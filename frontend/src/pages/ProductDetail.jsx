import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { ChevronLeft, Plus, Minus, ShoppingBasket, Star, ShieldCheck, Truck, TrendingUp } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { cartItems, addToCart, updateQty } = useCart();

    const [product, setProduct] = useState(null);
    const [recommended, setRecommended] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);

                // Fetch all products to filter recommended (e.g., same category)
                const { data: allProducts } = await api.get('/products');
                const filtered = allProducts
                    .filter(p => p.category === data.category && p._id !== data._id)
                    .slice(0, 4);
                setRecommended(filtered);
            } catch (error) {
                console.error('Error fetching product details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Product not found.</p>
                <button onClick={() => navigate('/')} className="mt-4 text-primary-500 font-bold">Back to Home</button>
            </div>
        );
    }

    const cartItem = cartItems.find((item) => item.product === product._id);
    const discountPercentage = product.discountPrice
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

    return (
        <div className="animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-xl font-bold truncate">{product.name}</h1>
            </div>

            {/* Product Info */}
            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
                <div className="relative aspect-square">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    {product.isTrending && (
                        <div className="absolute top-6 left-6 bg-amber-400 text-white px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-amber-200">
                            <TrendingUp size={14} /> Trending Now
                        </div>
                    )}
                    {discountPercentage > 0 && (
                        <div className="absolute top-6 right-6 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-green-200">
                            {discountPercentage}% OFF
                        </div>
                    )}
                </div>

                <div className="p-8 space-y-6">
                    <div>
                        <span className="text-xs font-black text-primary-600 uppercase tracking-widest mb-2 block">{product.category}</span>
                        <h2 className="text-3xl font-black text-slate-800 leading-tight">{product.name}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex text-amber-400">
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" className="text-gray-200" />
                            </div>
                            <span className="text-sm font-bold text-gray-400">(4.0 / 5.0)</span>
                        </div>
                    </div>

                    <div className="flex items-end gap-3">
                        <div className="flex flex-col">
                            {product.discountPrice ? (
                                <>
                                    <span className="text-4xl font-black text-slate-900 tracking-tight">₹{product.discountPrice.toFixed(2)}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg text-gray-400 line-through">₹{product.price.toFixed(2)}</span>
                                        <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest">Save ₹{(product.price - product.discountPrice).toFixed(2)}</span>
                                    </div>
                                </>
                            ) : (
                                <span className="text-4xl font-black text-slate-900 tracking-tight">₹{product.price.toFixed(2)}</span>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-slate-600">
                            <ShieldCheck size={20} className="text-primary-500" />
                            <span className="text-sm font-medium">100% Quality Assurance</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                            <Truck size={20} className="text-primary-500" />
                            <span className="text-sm font-medium">Fast Delivery (Within 15-30 mins)</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Product Description</h4>
                        <p className="text-slate-500 leading-relaxed font-medium">
                            {product.description || "No description available for this product."}
                        </p>
                    </div>

                    {/* Quantity & Add to Cart */}
                    <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex items-center gap-4 z-50 md:relative md:p-0 md:bg-transparent md:border-none">
                        {cartItem ? (
                            <div className="flex items-center justify-between bg-slate-100 rounded-2xl px-6 py-4 flex-1">
                                <button
                                    onClick={() => updateQty(product._id, cartItem.qty - 1)}
                                    className="p-2 hover:bg-white rounded-xl transition-all active:scale-90"
                                >
                                    <Minus size={20} className="text-primary-600" />
                                </button>
                                <span className="text-xl font-black text-slate-800">{cartItem.qty}</span>
                                <button
                                    onClick={() => updateQty(product._id, cartItem.qty + 1)}
                                    className="p-2 hover:bg-white rounded-xl transition-all active:scale-90"
                                    disabled={cartItem.qty >= product.stock}
                                >
                                    <Plus size={20} className="text-primary-600" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => addToCart(product, 1)}
                                disabled={product.stock === 0}
                                className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[22px] font-black uppercase tracking-widest text-sm shadow-xl transition-all active:scale-95 ${product.stock === 0
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                        : 'bg-primary-500 text-white shadow-primary-500/30 hover:bg-primary-600'
                                    }`}
                            >
                                <ShoppingBasket size={20} />
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Basket'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Recommended Products */}
            {recommended.length > 0 && (
                <div className="mt-12 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">You might also like</h3>
                        <span className="text-xs font-bold text-primary-500 uppercase tracking-widest px-3 py-1 bg-primary-50 rounded-full">See More</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {recommended.map(item => (
                            <ProductCard key={item._id} product={item} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
