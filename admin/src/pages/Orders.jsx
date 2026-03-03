import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Package, Truck, CheckCircle, Clock, Search, ShoppingCart, X, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import socket from '../socket/socket';

const statusColors = {
    'Pending': 'bg-orange-100 text-orange-600 border-orange-200',
    'Accepted': 'bg-blue-100 text-blue-600 border-blue-200',
    'Out for Delivery': 'bg-indigo-100 text-indigo-600 border-indigo-200',
    'Delivered': 'bg-green-100 text-green-600 border-green-200',
};

// Toast Notification
const Toast = ({ msg, onClose }) => (
    <div className="fixed top-6 right-6 bg-primary-600 text-white px-5 py-4 rounded-2xl shadow-2xl shadow-primary-500/30 flex items-center gap-3 z-50 animate-in slide-in-from-top-4 duration-400 max-w-sm">
        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <ShoppingCart size={18} />
        </div>
        <div className="flex-1">
            <p className="font-black text-sm">New Order Alert! 🚚</p>
            <p className="text-xs text-white/80 mt-0.5">{msg}</p>
        </div>
        <button onClick={onClose} className="text-white/60 hover:text-white ml-1">
            <X size={16} />
        </button>
    </div>
);

const OrderRow = ({ order, updateStatus }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <>
            <tr className="table-row-hover transition-colors font-medium border-b border-slate-50 last:border-none">
                <td className="px-6 py-5">
                    <p className="text-sm font-black text-slate-800 tracking-wider">#{order._id.slice(-6).toUpperCase()}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                        <MapPin size={12} className="flex-shrink-0" />
                        <span className="truncate max-w-[150px]" title={order.deliveryAddress}>{order.deliveryAddress}</span>
                    </div>
                </td>
                <td className="px-6 py-5">
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-700">{new Date(order.createdAt).toLocaleDateString()}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </td>
                <td className="px-6 py-5">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{order.user?.name || 'Guest'}</span>
                        <span className="text-xs text-slate-400">{order.user?.email || ''}</span>
                    </div>
                </td>
                <td className="px-6 py-5 text-sm font-bold text-slate-500">
                    ₹{order.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-5">
                    <div className="flex -space-x-2">
                        {order.orderItems.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="relative flex-shrink-0">
                                <img
                                    src={item.product?.image || item.image}
                                    alt={item.name}
                                    className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm bg-slate-50"
                                />
                                {item.qty > 0 && (
                                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary-500 text-white text-[8px] font-black rounded-full flex items-center justify-center z-10 border-2 border-white shadow-sm">
                                        {item.qty}
                                    </span>
                                )}
                            </div>
                        ))}
                        {order.orderItems.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400 z-10 relative">
                                +{order.orderItems.length - 3}
                            </div>
                        )}
                    </div>
                </td>
                <td className="px-6 py-5">
                    <span className={`px-3 py-1.2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusColors[order.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {order.status}
                    </span>
                </td>
                <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-1 items-center">
                        {order.status === 'Delivered' ? (
                            <div className="bg-green-100 text-green-600 p-2 rounded-xl flex items-center gap-1.5 px-3 border border-green-200">
                                <CheckCircle size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Completed</span>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => updateStatus(order._id, 'Accepted')}
                                    className={`p-2 rounded-lg transition-colors ${order.status === 'Accepted' ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-50'}`}
                                    title="Accept Order"
                                    disabled={order.status === 'Accepted'}
                                ><Clock size={16} /></button>
                                <button
                                    onClick={() => updateStatus(order._id, 'Out for Delivery')}
                                    className={`p-2 rounded-lg transition-colors ${order.status === 'Out for Delivery' ? 'bg-indigo-500 text-white' : 'text-indigo-500 hover:bg-indigo-50'}`}
                                    title="Out for Delivery"
                                    disabled={order.status === 'Out for Delivery'}
                                ><Truck size={16} /></button>
                                <button
                                    onClick={() => updateStatus(order._id, 'Delivered')}
                                    className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Delivered"
                                ><CheckCircle size={16} /></button>
                            </>
                        )}
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="ml-2 p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                    </div>
                </td>
            </tr>
            {expanded && (
                <tr className="bg-slate-50/50">
                    <td colSpan={6} className="px-6 py-4">
                        <div className="bg-white border text-sm border-slate-100 rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-top-1">
                            <h5 className="font-bold text-slate-700 mb-3 border-b border-slate-50 pb-2">Order Items ({order.orderItems.length})</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-3 items-center">
                                        <img
                                            src={item.product?.image || item.image}
                                            alt={item.name}
                                            className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-slate-100"
                                        />
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm truncate max-w-[150px]">{item.product?.name || item.name}</p>
                                            <p className="text-xs text-slate-500">Qty: {item.qty} x ₹{(item.product?.price || item.price || 0).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-medium">Placed: {new Date(order.createdAt).toLocaleString()}</span>
                                <span className="font-bold text-slate-700">Total: ₹{order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [toasts, setToasts] = useState([]);

    const addToast = (msg) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, msg }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 6000);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders');
                setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();

        const handleNewOrder = (order) => {
            setOrders(prev => [order, ...prev]);
            addToast(`New order from ${order.user?.name || 'Guest'} to ${order.deliveryAddress}. Amount: ₹${order.totalAmount?.toFixed(2)}`);
        };

        socket.on('newOrder', handleNewOrder);
        return () => socket.off('newOrder', handleNewOrder);
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
        } catch (err) {
            console.error(err);
        }
    };

    const filteredOrders = orders
        .filter(o => filter === 'All' ? true : o.status === filter)
        .filter(o =>
            o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.deliveryAddress || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div className="space-y-8 p-8 pl-72 bg-slate-50/50 min-h-screen">
            {/* Toast Notifications */}
            <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
                {toasts.map(t => (
                    <Toast key={t.id} msg={t.msg} onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))} />
                ))}
            </div>

            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Orders Management</h2>
                    <p className="text-slate-500 font-medium mt-1">Process fulfilling orders and track deliveries.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search Order ID, Address, Customer..."
                            className="bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 w-72 outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm font-medium text-sm text-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <select
                            className="bg-white border border-slate-200 rounded-xl py-3 pl-4 pr-10 shadow-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-bold text-slate-700 appearance-none text-sm cursor-pointer"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3.5 top-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="dashboard-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-black uppercase tracking-widest text-[10px]">
                                <tr>
                                    <th className="px-6 py-4">Order Details</th>
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Items</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <OrderRow key={order._id} order={order} updateStatus={updateStatus} />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                                            No orders found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
