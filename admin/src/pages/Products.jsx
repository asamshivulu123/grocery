import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Package, Plus, Search, Edit2, Trash2, X, Upload } from 'lucide-react';
import socket from '../socket/socket';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        discountPrice: '',
        isTrending: false,
        isFlashDeal: false,
        description: '',
        image: '',
        category: 'Vegetables',
        stock: '',
    });

    useEffect(() => {
        fetchProducts();

        const handleOrderUpdate = () => {
            fetchProducts();
        };

        socket.on('newOrder', handleOrderUpdate);
        return () => socket.off('newOrder', handleOrderUpdate);
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price,
                discountPrice: product.discountPrice || '',
                isTrending: product.isTrending || false,
                isFlashDeal: product.isFlashDeal || false,
                description: product.description,
                image: product.image,
                category: product.category,
                stock: product.stock,
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                price: '',
                discountPrice: '',
                isTrending: false,
                isFlashDeal: false,
                description: '',
                image: '',
                category: 'Vegetables',
                stock: '',
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, formData);
            } else {
                await api.post('/products', formData);
            }
            fetchProducts();
            setShowModal(false);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="space-y-8 p-8 pl-72 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Product Inventory</h2>
                    <p className="text-slate-500 font-medium">Manage your community market's stock and categories.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-primary-500/20 active:scale-95 transition-all flex items-center gap-2"
                >
                    <Plus size={20} /> Add New Product
                </button>
            </div>

            <div className="dashboard-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                            <tr>
                                <th className="px-6 py-4">Product Info</th>
                                <th className="px-6 py-4 text-center">Price</th>
                                <th className="px-6 py-4 text-center">Flash Deal</th>
                                <th className="px-6 py-4 text-center">Trending</th>
                                <th className="px-6 py-4 text-center">Inventory</th>
                                <th className="px-6 py-4 text-center">Category</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {products.map((p) => (
                                <tr key={p._id} className="table-row-hover transition-colors font-medium">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <img src={p.image} className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm" alt={p.name} />
                                            <div className="min-w-0">
                                                <p className="text-sm font-black text-slate-800 tracking-tight truncate">{p.name}</p>
                                                <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-xs">{p.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center text-slate-900 font-black tracking-tight">₹{p.price.toFixed(2)}</td>
                                    <td className="px-6 py-5 text-center">
                                        {p.isFlashDeal ? (
                                            <div className="flex flex-col items-center">
                                                <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-[10px] font-bold uppercase mb-1">Active Deal</span>
                                                <span className="text-[10px] text-primary-600 font-black">₹{p.discountPrice?.toFixed(2)}</span>
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        {p.isTrending ? (
                                            <span className="bg-amber-100 text-amber-600 px-2 py-1 rounded text-[10px] font-bold uppercase">Trending</span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        {p.stock <= 0 ? (
                                            <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-500 text-white shadow-sm shadow-red-500/30 animate-[pulse_2s_ease-in-out_infinite]">
                                                Out of Stock
                                            </span>
                                        ) : (
                                            <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${p.stock < 5 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {p.stock} units
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-center text-xs font-bold text-primary-600 uppercase tracking-widest bg-primary-50/10">{p.category}</td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-1">
                                            <button onClick={() => handleOpenModal(p)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                                            <button onClick={() => deleteProduct(p._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
                    <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl p-8 animate-in zoom-in duration-300 relative">
                        <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={24} /></button>
                        <h3 className="text-2xl font-black text-slate-800 mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>

                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-primary-500 shadow-sm font-bold text-slate-700"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-primary-500 shadow-sm font-bold text-slate-700"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Discount Price (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-primary-500 shadow-sm font-bold text-slate-700"
                                    value={formData.discountPrice}
                                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2 col-span-2 flex items-center gap-6 bg-slate-50 p-4 rounded-2xl">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isTrending"
                                        className="w-5 h-5 accent-primary-500 rounded border-slate-300"
                                        checked={formData.isTrending}
                                        onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                                    />
                                    <label htmlFor="isTrending" className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer">Most Trending</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isFlashDeal"
                                        className="w-5 h-5 accent-green-500 rounded border-slate-300"
                                        checked={formData.isFlashDeal}
                                        onChange={(e) => setFormData({ ...formData, isFlashDeal: e.target.checked })}
                                    />
                                    <label htmlFor="isFlashDeal" className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer">Flash Deal</label>
                                </div>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea
                                    className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-primary-500 shadow-sm font-bold text-slate-700 h-24"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-primary-500 shadow-sm font-bold text-slate-700"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    required
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                <select
                                    className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-primary-500 shadow-sm font-bold text-slate-700"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option>Vegetables</option>
                                    <option>Fruits</option>
                                    <option>Dairy</option>
                                    <option>Bakery</option>
                                    <option>Beverages</option>
                                    <option>Snacks</option>
                                    <option>Pantry</option>
                                </select>
                            </div>
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Count</label>
                                <input
                                    type="number"
                                    className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-primary-500 shadow-sm font-bold text-slate-700"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-2xl col-span-2 mt-4 shadow-xl shadow-primary-500/20 active:scale-95 transition-all uppercase tracking-widest text-sm"
                            >
                                {editingProduct ? 'Update Product' : 'Add to Catalog'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
