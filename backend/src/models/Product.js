const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, default: 0 },
        discountPrice: { type: Number, default: 0 },
        isTrending: { type: Boolean, default: false },
        isFlashDeal: { type: Boolean, default: false },
        image: { type: String, required: true },
        category: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
