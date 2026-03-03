const Order = require('../models/Order');
const Product = require('../models/Product');

const addOrderItems = async (req, res) => {
    const { orderItems, deliveryAddress, totalAmount } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    }

    // Stock check
    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product || product.stock < item.qty) {
            res.status(400).json({ message: `Insufficient stock for ${product?.name}` });
            return;
        }
    }

    const order = new Order({
        orderItems,
        user: req.user._id,
        deliveryAddress,
        totalAmount,
    });

    const createdOrder = await order.save();

    // Deduct stock
    for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.qty },
        });
    }

    // Socket Notify Admin
    const io = req.app.get('io');
    io.emit('newOrder', createdOrder);

    res.status(201).json(createdOrder);
};

const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
};

const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
};

const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = status;
        const updatedOrder = await order.save();

        // Socket Notify User
        const io = req.app.get('io');
        io.to(order.user.toString()).emit('orderStatusUpdated', {
            orderId: order._id,
            status: status,
        });

        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

module.exports = {
    addOrderItems,
    getMyOrders,
    getOrders,
    updateOrderStatus,
};
