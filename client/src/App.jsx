// File: client/src/App.jsx

import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate, // 👈 Add this
} from "react-router-dom";

// Page Imports
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Pos from "./pages/Pos";
import SalesHistory from "./pages/SalesHistory";
import ReturnHistory from "./pages/ReturnHistory";
import Customers from "./pages/Customers";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) => {
    const base =
      "block px-3 py-2 font-semibold rounded-md transition-colors duration-200";
    return isActive
      ? `${base} text-white bg-blue-600`
      : `${base} text-gray-300 hover:text-white hover:bg-gray-700`;
  };

  return (
    <BrowserRouter>
      {/* Navbar */}
      <nav className="bg-gray-900 w-full">
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          {/* Brand */}
          <NavLink to="/" className="text-2xl font-bold text-white">
            Vivah Galaxy
          </NavLink>

          {/* Hamburger (Mobile) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-300 hover:text-white focus:outline-none md:hidden"
          >
            {menuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          {/* Links (Desktop) */}
          <ul className="hidden md:flex space-x-2 items-center">
            <li>
              <NavLink to="/" className={navLinkClass}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/pos" className={navLinkClass}>
                Billing (POS)
              </NavLink>
            </li>
            <li>
              <NavLink to="/products" className={navLinkClass}>
                Products
              </NavLink>
            </li>
            <li>
              <NavLink to="/sales" className={navLinkClass}>
                Sales History
              </NavLink>
            </li>
            <li>
              <NavLink to="/returns" className={navLinkClass}>
                Return History
              </NavLink>
            </li>
            <li>
              <NavLink to="/customers" className={navLinkClass}>
                Customers
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Links (Mobile Dropdown) */}
        {menuOpen && (
          <div className="md:hidden bg-gray-800 px-4 pb-3 space-y-1">
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/pos"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Billing (POS)
            </NavLink>
            <NavLink
              to="/products"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Products
            </NavLink>
            <NavLink
              to="/sales"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Sales History
            </NavLink>
            <NavLink
              to="/returns"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Return History
            </NavLink>
            <NavLink
              to="/customers"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Customers
            </NavLink>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pos" element={<Pos />} />
          <Route path="/products" element={<Products />} />
          <Route path="/sales" element={<SalesHistory />} />
          <Route path="/returns" element={<ReturnHistory />} />
          <Route path="/customers" element={<Customers />} />

          {/* 👇 Default redirect if no route matches */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
