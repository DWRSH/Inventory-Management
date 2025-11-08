// File: server/models/sale.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }, // कितनी क्वांटिटी बिकी थी
      },
    ],
    
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Cash', 'Card', 'UPI', 'Multiple'],
      default: 'Cash',
    },
    
    amountPaid: {
      type: Number,
      required: true,
      default: 0,
    },
    amountDue: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['Paid', 'Partial', 'Unpaid'],
      default: 'Paid',
    },

    // --- (नया) यह ट्रैक करेगा कि इस बिल से क्या वापस आया ---
    // यह 'Return' मॉडल से नहीं, बल्कि यहीं पर एक सब-डॉक्यूमेंट है
    returnedItems: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantityReturned: {
          type: Number,
          required: true,
        },
      }
    ]
    // ---
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Sale', saleSchema);