const Product = require('../models/Product');

const getProducts = async (req, res) => {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
};

const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

const createProduct = async (req, res) => {
    const { name, price, discountPrice, isTrending, isFlashDeal, description, image, category, stock } = req.body;
    const product = new Product({
        name,
        price,
        discountPrice,
        isTrending,
        isFlashDeal,
        user: req.user._id,
        image,
        category,
        stock,
        description,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

const updateProduct = async (req, res) => {
    const { name, price, discountPrice, isTrending, isFlashDeal, description, image, category, stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;
        product.isTrending = isTrending !== undefined ? isTrending : product.isTrending;
        product.isFlashDeal = isFlashDeal !== undefined ? isFlashDeal : product.isFlashDeal;
        product.description = description || product.description;
        product.image = image || product.image;
        product.category = category || product.category;
        product.stock = stock || product.stock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
