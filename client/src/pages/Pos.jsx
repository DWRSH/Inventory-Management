// File: client/src/pages/Pos.jsx

import React, { useState, useEffect, useMemo } from "react";
import productService from "../services/product.service";
import saleService from "../services/sale.service";

function ProductCard({ product, onAddToCart }) {
  const hasStock = product.stock > 0;
  return (
    <div
      className={`border rounded-lg p-3 flex flex-col justify-between shadow-sm bg-white transition-all duration-200 
      ${
        hasStock
          ? "cursor-pointer hover:shadow-md hover:-translate-y-1"
          : "opacity-50 cursor-not-allowed"
      }`}
      onClick={() => hasStock && onAddToCart(product)}
    >
      <div>
        <h3 className="font-semibold text-sm truncate">{product.name}</h3>
        <p className="text-xs text-gray-600">{product.category}</p>
      </div>
      <div className="mt-2">
        <p className="text-sm font-bold">₹{product.price.toFixed(2)}</p>
        {hasStock ? (
          <span className="text-xs text-gray-500">Stock: {product.stock}</span>
        ) : (
          <span className="text-xs text-red-500 font-bold">Out of Stock</span>
        )}
      </div>
    </div>
  );
}

function Pos() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBillMobile, setShowBillMobile] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Customer info
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [amountPaid, setAmountPaid] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts();
      setProducts(res.data);
    } catch (e) {
      console.error("Error fetching products:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (product.stock <= 0) return alert("This product is out of stock!");
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      if (existing.quantity >= product.stock)
        return alert("No more stock available for this item!");
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setShowBillMobile(true);
  };

  const handleUpdateQuantity = (id, qty) => {
    const product = products.find((p) => p._id === id);
    if (product && qty > product.stock)
      return alert(`Cannot exceed stock (${product.stock}).`);
    if (qty <= 0) setCart(cart.filter((item) => item._id !== id));
    else setCart(cart.map((i) => (i._id === id ? { ...i, quantity: qty } : i)));
  };

  const totalAmount = useMemo(
    () => cart.reduce((t, i) => t + i.price * i.quantity, 0),
    [cart]
  );

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [products, searchTerm]
  );

  useEffect(() => {
    if (paymentStatus === "Paid") setAmountPaid(totalAmount.toFixed(2));
    else if (paymentStatus === "Unpaid") setAmountPaid("0");
    else if (paymentStatus === "Partial") setAmountPaid("");
  }, [paymentStatus, totalAmount]);

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^\d{10}$/;
    if (!customerName) newErrors.customerName = "Customer name is required.";
    if (!customerPhone) newErrors.customerPhone = "Phone is required.";
    else if (!phoneRegex.test(customerPhone))
      newErrors.customerPhone = "Phone must be 10 digits.";
    if (!customerAddress)
      newErrors.customerAddress = "Customer address is required.";
    const paid = parseFloat(amountPaid);
    if (amountPaid === "" || isNaN(paid))
      newErrors.amountPaid = "Amount paid is required.";
    else if (paid < 0) newErrors.amountPaid = "Cannot be negative.";
    else if (paid > totalAmount) newErrors.amountPaid = "Cannot exceed total.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;
    if (cart.length === 0) return alert("Cart is empty");

    setIsProcessing(true);
    try {
      await saleService.createSale({
        cart,
        totalAmount,
        paymentMethod,
        customerName,
        customerPhone,
        customerAddress,
        paymentStatus,
        amountPaid: parseFloat(amountPaid),
      });
      setShowSummary(true); // ✅ Show popup
    } catch (err) {
      alert(err.response?.data?.message || "Failed to record sale");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    setCart([]);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setPaymentStatus("Paid");
    setAmountPaid("");
    fetchProducts();
    setShowBillMobile(false);
  };

  const dueAmount = totalAmount - parseFloat(amountPaid || 0);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-gray-50 relative">
      {/* Left Side */}
      <div
        className={`w-full md:w-3/5 p-4 overflow-y-auto transition-all duration-300 ${
          showBillMobile ? "hidden md:block" : "block"
        }`}
      >
        <input
          type="text"
          placeholder="Search by product name or SKU..."
          className="w-full p-3 border rounded-lg shadow-sm mb-4 focus:ring focus:ring-blue-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right Side (Bill Section) */}
      <div
        className={`fixed inset-x-0 bottom-0 md:static md:w-2/5 flex flex-col bg-white border-t md:border-l shadow-lg 
        transition-transform duration-300 transform ${
          showBillMobile ? "translate-y-0" : "translate-y-full md:translate-y-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b bg-gray-100 md:hidden">
          <h2 className="font-bold text-lg">Bill</h2>
          <button
            className="text-blue-600 font-semibold"
            onClick={() => setShowBillMobile(false)}
          >
            ← Back
          </button>
        </div>

        <h2 className="hidden md:block text-xl font-bold p-4 border-b">Bill</h2>

        {/* Cart Items */}
        <div className="flex-grow p-4 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Cart is empty</p>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center mb-3 p-2 rounded hover:bg-gray-50"
              >
                <div>
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                  <p className="text-xs text-gray-600">
                    ₹{item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    className="w-14 text-center border rounded-md p-1 mx-2"
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateQuantity(item._id, parseInt(e.target.value))
                    }
                  />
                  <button
                    onClick={() => handleUpdateQuantity(item._id, 0)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    X
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t bg-gray-50">
          {/* Customer Info */}
          <div className="mb-2">
            <label className="text-sm font-medium">Customer Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="text-sm font-medium">Customer Phone</label>
            <input
              type="tel"
              className="w-full p-2 border rounded-md"
              value={customerPhone}
              maxLength={10}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="text-sm font-medium">Customer Address</label>
            <textarea
              rows="2"
              className="w-full p-2 border rounded-md"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="text-sm font-medium">Payment Method</label>
              <select
                className="w-full p-2 border rounded-md"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option>Cash</option>
                <option>Card</option>
                <option>UPI</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Payment Status</label>
              <select
                className="w-full p-2 border rounded-md"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                <option>Paid</option>
                <option>Partial</option>
                <option>Unpaid</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="text-sm font-medium">Amount Paid (₹)</label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center my-3">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-xl font-bold">₹{totalAmount.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing}
            className="w-full bg-green-600 text-white py-3 font-bold rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {isProcessing ? "Processing..." : "Save Bill"}
          </button>
        </div>
      </div>

      {/* ✅ Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-11/12 md:w-1/2 p-5 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-3 text-center">Bill Summary</h2>
            <hr className="mb-3" />

            <div className="mb-2">
              <p><strong>Name:</strong> {customerName}</p>
              <p><strong>Phone:</strong> {customerPhone}</p>
              <p><strong>Address:</strong> {customerAddress}</p>
            </div>

            <div className="border-t my-3"></div>

            <h3 className="font-semibold mb-2">Items:</h3>
            <ul className="text-sm mb-3">
              {cart.map((item) => (
                <li key={item._id} className="flex justify-between">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="border-t my-3"></div>

            <div className="text-right">
              <p><strong>Total:</strong> ₹{totalAmount.toFixed(2)}</p>
              <p><strong>Paid:</strong> ₹{parseFloat(amountPaid || 0).toFixed(2)}</p>
              <p>
                <strong>Due:</strong>{" "}
                <span className={dueAmount > 0 ? "text-red-500 font-bold" : "text-green-600 font-bold"}>
                  ₹{dueAmount.toFixed(2)}
                </span>
              </p>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => window.print()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Print
              </button>
              <button
                onClick={handleCloseSummary}
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pos;
