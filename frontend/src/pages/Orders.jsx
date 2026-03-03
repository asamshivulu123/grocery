import { useState, useEffect } from 'react';
import api from '../api/axios';
import socket from '../socket/socket';
import { useAuth } from '../context/AuthContext';
import {
    Package, Truck, CheckCircle, Clock, ChevronDown,
    ChevronUp, MapPin, ShoppingBag
} from 'lucide-react';

const statusConfig = {
    'Pending': { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
    'Accepted': { icon: Package, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
    'Out for Delivery': { icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    'Delivered': { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-100' },
};

const StatusBadge = ({ status }) => {
    const cfg = statusConfig[status] || statusConfig['Pending'];
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${cfg.color} ${cfg.bg} border ${cfg.border}`}>
            <Icon size={13} />
            {status}
        </span>
    );
};

const OrderCard = ({ order }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all">
            {/* Order Header */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                            Order #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <StatusBadge status={order.status} />
                    </div>
                    <span className="font-black text-lg text-gray-900">
                        ₹{order.totalAmount.toFixed(2)}
                    </span>
                </div>

                {/* Mini product image strip */}
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {order.orderItems.map((item, idx) => (
                        <div key={idx} className="relative flex-shrink-0">
                            <img
                                src={item.product?.image || item.image}
                                alt={item.product?.name || 'Product'}
                                className="w-11 h-11 object-cover rounded-xl border border-gray-100"
                            />
                            {item.qty > 1 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                    {item.qty}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-400 font-medium">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center gap-1 text-primary-600 font-bold text-xs hover:text-primary-700 transition-colors"
                    >
                        {expanded ? 'Hide Details' : 'View Details'}
                        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>
            </div>

            {/* Expandable Details Panel */}
            {expanded && (
                <div className="border-t border-gray-50 bg-gray-50/70 px-5 py-4 space-y-4 animate-in slide-in-from-top-2 duration-200">

                    {/* Delivery Address */}
                    {order.deliveryAddress && (
                        <div className="flex gap-2">
                            <MapPin size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Delivery Address</p>
                                <p className="text-sm font-semibold text-gray-700">{order.deliveryAddress}</p>
                            </div>
                        </div>
                    )}

                    {/* Order Items Breakdown */}
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Items Ordered</p>
                        <div className="space-y-2">
                            {order.orderItems.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-gray-100">
                                    <img
                                        src={item.product?.image || item.image}
                                        alt={item.product?.name || 'Product'}
                                        className="w-10 h-10 object-cover rounded-xl"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-800 truncate">
                                            {item.product?.name || 'Product'}
                                        </p>
                                        <p className="text-xs text-gray-400 font-medium">
                                            ₹{(item.product?.price || item.price || 0).toFixed(2)} × {item.qty}
                                        </p>
                                    </div>
                                    <span className="font-black text-sm text-gray-900">
                                        ₹{((item.product?.price || item.price || 0) * item.qty).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Summary */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="text-sm font-bold text-gray-500">Order Total</span>
                        <span className="font-black text-base text-primary-600">₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/my');
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();

        if (user) {
            socket.emit('join', user._id);
            const handleStatusUpdate = (update) => {
                setOrders(prev => prev.map(o =>
                    o._id === update.orderId ? { ...o, status: update.status } : o
                ));
            };
            socket.on('orderStatusUpdated', handleStatusUpdate);
            return () => socket.off('orderStatusUpdated', handleStatusUpdate);
        }
    }, [user]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-500 font-medium text-sm">Fetching your orders...</p>
        </div>
    );

    if (orders.length === 0) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={36} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-bold text-base">No orders yet</p>
            <p className="text-gray-400 text-sm mt-1">Start shopping to place your first order!</p>
        </div>
    );

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 px-1">My Orders</h2>
            <p className="text-xs text-gray-400 font-medium px-1">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
            <div className="space-y-4">
                {orders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                ))}
            </div>
        </div>
    );
};

export default Orders;
