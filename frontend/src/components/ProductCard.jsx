import { ShoppingBasket, Plus, Minus, TrendingUp } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const { cartItems, addToCart, updateQty } = useCart();
    const navigate = useNavigate();
    const cartItem = cartItems.find((item) => item.product === product._id);

    const discountPercentage = product.discountPrice
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

    return (
        <div
            onClick={() => navigate(`/product/${product._id}`)}
            className="product-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-md transition-all duration-300"
        >
            <div className="relative aspect-square">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isTrending && (
                        <span className="bg-amber-400 text-white px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter flex items-center gap-0.5 shadow-sm">
                            <TrendingUp size={10} /> Trending
                        </span>
                    )}
                    {discountPercentage > 0 && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm">
                            {discountPercentage}% OFF
                        </span>
                    )}
                </div>
                {product.stock <= 5 && product.stock > 0 && (
                    <span className="absolute bottom-2 left-2 bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-[10px] font-bold">
                        Only {product.stock} left
                    </span>
                )}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center font-bold text-red-500 uppercase tracking-wider text-sm">
                        Out of stock
                    </div>
                )}
            </div>
            <div className="p-3">
                <span className="text-[10px] text-primary-600 font-bold uppercase tracking-wider">{product.category}</span>
                <h3 className="text-sm font-semibold truncate mt-0.5">{product.name}</h3>
                <div className="mt-2 flex justify-between items-center">
                    <div className="flex flex-col">
                        {product.discountPrice ? (
                            <>
                                <span className="font-bold text-gray-900 leading-none">₹{product.discountPrice.toFixed(2)}</span>
                                <span className="text-[10px] text-gray-400 line-through mt-0.5">₹{product.price.toFixed(2)}</span>
                            </>
                        ) : (
                            <span className="font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
                        )}
                    </div>
                    {cartItem ? (
                        <div
                            className="flex items-center gap-3 bg-primary-100/50 rounded-full px-2 py-1"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => updateQty(product._id, cartItem.qty - 1)}
                                className="p-1 hover:bg-white rounded-full transition-colors"
                            >
                                <Minus size={14} className="text-primary-600" />
                            </button>
                            <span className="text-xs font-bold text-primary-700">{cartItem.qty}</span>
                            <button
                                onClick={() => updateQty(product._id, cartItem.qty + 1)}
                                className="p-1 hover:bg-white rounded-full transition-colors"
                                disabled={cartItem.qty >= product.stock}
                            >
                                <Plus size={14} className="text-primary-600" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product, 1);
                            }}
                            disabled={product.stock === 0}
                            className={`p-2 rounded-xl transition-all ${product.stock === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-primary-500 text-white shadow-lg shadow-primary-200 active:scale-95 hover:bg-primary-600'
                                }`}
                        >
                            <Plus size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
