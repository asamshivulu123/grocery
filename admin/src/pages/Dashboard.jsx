import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { ShoppingCart, DollarSign, Package, TrendingUp, Bell, X, ChevronRight, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import socket from '../socket/socket';
import { useNavigate } from 'react-router-dom';

// Compute month-by-month chart data from real orders array
const buildChartData = (orders) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    // Build last 6 months
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({ year: d.getFullYear(), month: d.getMonth(), name: monthNames[d.getMonth()] });
    }
    return months.map(({ year, month, name }) => {
        const monthOrders = orders.filter(o => {
            const d = new Date(o.createdAt);
            return d.getFullYear() === year && d.getMonth() === month;
        });
        return {
            name,
            revenue: parseFloat(monthOrders.reduce((acc, o) => acc + o.totalAmount, 0).toFixed(2)),
            orders: monthOrders.length,
        };
    });
};

// Toast Notification
const Toast = ({ msg, onClose }) => (
    <div className="fixed top-6 right-6 bg-primary-600 text-white px-5 py-4 rounded-2xl shadow-2xl shadow-primary-500/30 flex items-center gap-3 z-50 animate-in slide-in-from-top-4 duration-400 max-w-sm">
        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <ShoppingCart size={18} />
        </div>
        <div className="flex-1">
            <p className="font-black text-sm">New Order Received! 🛒</p>
            <p className="text-xs text-white/80 mt-0.5">{msg}</p>
        </div>
        <button onClick={onClose} className="text-white/60 hover:text-white ml-1">
            <X size={16} />
        </button>
    </div>
);

const statusColors = {
    'Pending': 'bg-orange-100 text-orange-600',
    'Accepted': 'bg-blue-100 text-blue-600',
    'Out for Delivery': 'bg-indigo-100 text-indigo-600',
    'Delivered': 'bg-green-100 text-green-600',
};

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toasts, setToasts] = useState([]);
    const navigate = useNavigate();
    const audioRef = useRef(null);

    const addToast = (msg) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, msg }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 6000);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, productsRes] = await Promise.all([
                    api.get('/orders'),
                    api.get('/products'),
                ]);
                setOrders(ordersRes.data);
                setProducts(productsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        const handleNewOrder = async (order) => {
            setOrders(prev => [order, ...prev]);
            try {
                const updatedProducts = await api.get('/products');
                setProducts(updatedProducts.data);
            } catch (err) { }
            const itemCount = order.orderItems?.length || 1;
            addToast(`Order #${order._id.slice(-6).toUpperCase()} — ${itemCount} item${itemCount > 1 ? 's' : ''} — ₹${order.totalAmount?.toFixed(2)}`);
        };

        socket.on('newOrder', handleNewOrder);
        return () => socket.off('newOrder', handleNewOrder);
    }, []);

    const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const chartData = buildChartData(orders);
    const recentOrders = orders.slice(0, 5);

    const statCards = [
        { label: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-primary-500', bg: 'bg-primary-50' },
        { label: 'Total Orders', value: totalOrders, icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Products', value: products.length, icon: Package, color: 'text-purple-500', bg: 'bg-purple-50' },
        { label: 'Pending', value: pendingOrders, icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
    ];

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen pl-64">
                <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-screen bg-slate-50/50 p-8 pl-72 space-y-8">

            {/* Toast Notifications */}
            <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
                {toasts.map(t => (
                    <Toast key={t.id} msg={t.msg} onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))} />
                ))}
            </div>

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard Overview</h2>
                    <p className="text-slate-500 font-medium mt-1">Real-time performance for your community market.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/orders')}
                        className="relative p-3 bg-white border border-slate-100 rounded-xl hover:bg-primary-50 hover:border-primary-100 transition-colors shadow-sm group"
                    >
                        <Bell size={20} className="text-slate-500 group-hover:text-primary-500 transition-colors" />
                        {pendingOrders > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                {pendingOrders}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Out of Stock Alert Banner */}
            {products.filter(p => p.stock <= 0).length > 0 && (
                <div className="bg-red-500 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-red-500/20 animate-in fade-in">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-2.5 rounded-xl">
                            <Package size={20} className="animate-pulse" />
                        </div>
                        <div>
                            <h4 className="font-black text-sm">Action Required: Depleted Inventory</h4>
                            <p className="text-xs text-red-100 font-medium">
                                {products.filter(p => p.stock <= 0).length} product(s) are completely out of stock. Please restock to avoid lost sales!
                            </p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/products')} className="bg-white text-red-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-red-50 transition-colors shadow-sm active:scale-95">
                        Manage Inventory
                    </button>
                </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.label} className="dashboard-card p-6">
                            <div className={`w-11 h-11 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-4`}>
                                <Icon size={22} />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">{card.label}</p>
                            <h3 className="text-3xl font-black text-slate-800">{card.value}</h3>
                        </div>
                    );
                })}
            </div>

            {/* Charts — real data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue */}
                <div className="dashboard-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-base font-black text-slate-800">Revenue Performance</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last 6 Months</span>
                    </div>
                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={v => `₹${v}`} />
                                <Tooltip
                                    formatter={(v) => [`₹${v}`, 'Revenue']}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 700 }}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Monthly Orders */}
                <div className="dashboard-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-base font-black text-slate-800">Monthly Orders</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last 6 Months</span>
                    </div>
                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                                <Tooltip
                                    formatter={(v) => [v, 'Orders']}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 700 }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Bar dataKey="orders" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={36} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="dashboard-card overflow-hidden">
                <div className="p-6 flex justify-between items-center border-b border-slate-50">
                    <h4 className="text-base font-black text-slate-800">Recent Orders</h4>
                    <button onClick={() => navigate('/orders')} className="text-xs font-bold text-primary-500 hover:text-primary-700 flex items-center gap-1 transition-colors">
                        View All <ChevronRight size={14} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                            <tr>
                                <th className="px-6 py-3">Order ID</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Items</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {recentOrders.map((order) => (
                                <tr key={order._id} className="table-row-hover font-medium">
                                    <td className="px-6 py-4 text-slate-800 font-black text-sm">
                                        #{order._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-sm">{order.user?.name || 'Guest'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex -space-x-2">
                                            {order.orderItems.slice(0, 3).map((item, idx) => (
                                                <div key={idx} className="relative flex-shrink-0">
                                                    <img
                                                        src={item.product?.image || item.image}
                                                        alt=""
                                                        className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm bg-white"
                                                    />
                                                    {item.qty > 0 && (
                                                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary-500 text-white text-[8px] font-black rounded-full flex items-center justify-center z-10 border-2 border-white shadow-sm">
                                                            {item.qty}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                            {order.orderItems.length > 3 && (
                                                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] font-black text-slate-500 z-10 relative">
                                                    +{order.orderItems.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${statusColors[order.status] || 'bg-slate-100 text-slate-500'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-900 font-black text-right">₹{order.totalAmount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {recentOrders.length === 0 && (
                        <div className="text-center py-12 text-slate-300 font-bold text-sm">No orders yet</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
