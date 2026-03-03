import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = () => {
    const { cartItems, updateQty, removeFromCart } = useCart();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const deliveryFee = subtotal > 0 ? 25 : 0; // Flat delivery fee
    const total = subtotal + deliveryFee;

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={40} className="text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
                <p className="text-gray-500 mt-2 font-medium">Add some fresh groceries to your cart to get started.</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-8 bg-primary-500 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-primary-100 active:scale-95 transition-all"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 px-1">My Cart</h2>

            <div className="space-y-4">
                {cartItems.map((item) => (
                    <div key={item.product} className="flex gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-primary-100">
                        <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                        <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                                <h3 className="font-bold text-gray-900 truncate pr-6">{item.name}</h3>
                                <p className="text-primary-600 font-bold text-sm mt-1">₹{item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1">
                                    <button
                                        onClick={() => updateQty(item.product, item.qty - 1)}
                                        className="p-1 hover:bg-white rounded-full transition-colors"
                                    >
                                        <Minus size={14} className="text-gray-500" />
                                    </button>
                                    <span className="text-xs font-bold text-gray-800">{item.qty}</span>
                                    <button
                                        onClick={() => updateQty(item.product, item.qty + 1)}
                                        className="p-1 hover:bg-white rounded-full transition-colors"
                                    >
                                        <Plus size={14} className="text-gray-500" />
                                    </button>
                                </div>
                                <button onClick={() => removeFromCart(item.product)} className="text-red-400 hover:text-red-600 transition-colors mr-1">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
                <div className="flex justify-between text-gray-500 font-medium">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-100 my-2"></div>
                <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-primary-600">₹{total.toFixed(2)}</span>
                </div>

                <button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-2xl mt-4 transition-all shadow-lg shadow-primary-200 active:scale-95 flex items-center justify-center gap-2"
                >
                    Check out <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default Cart;
