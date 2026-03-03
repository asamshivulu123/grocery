import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { MapPin, CreditCard, Loader2, CheckCircle2, ChevronLeft } from 'lucide-react';

const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const total = subtotal + 25; // Flat delivery fee

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!address) {
            setError('Please provide a delivery address');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await api.post('/orders', {
                orderItems: cartItems,
                deliveryAddress: address,
                totalAmount: total,
            });
            setSuccess(true);
            clearCart();
            setTimeout(() => navigate('/orders'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order. Try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-8 animate-bounce">
                    <CheckCircle2 size={56} className="text-primary-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h2>
                <p className="text-gray-500 font-medium">Thank you for shopping with us. Your fresh items will be at your door shortly.</p>
                <button
                    onClick={() => navigate('/orders')}
                    className="mt-10 bg-primary-500 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-primary-100 active:scale-95 transition-all w-full max-w-xs"
                >
                    Track My Order
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate('/cart')}
                    className="p-2 border border-gray-100 rounded-xl hover:bg-white active:scale-95 transition-all text-gray-600"
                >
                    <ChevronLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 pb-10">
                {error && <div className="p-3 bg-red-50 text-red-500 rounded-xl text-sm font-medium border border-red-100">{error}</div>}

                {/* Delivery Address Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-1 px-1">
                        <MapPin className="text-primary-600" size={20} />
                        <h3 className="font-bold text-gray-800 uppercase tracking-wider text-xs">Delivery Address</h3>
                    </div>
                    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4">
                        <textarea
                            placeholder="Block B, Apt 402, Gated Community Name..."
                            className="w-full h-24 bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary-100 transition-all font-medium text-sm"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        ></textarea>
                        <p className="text-[10px] text-gray-400 font-medium px-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full inline-block"></span>
                            Double check your unit number for faster delivery.
                        </p>
                    </div>
                </section>

                {/* Order Summary Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-1 px-1">
                        <CreditCard className="text-primary-600" size={20} />
                        <h3 className="font-bold text-gray-800 uppercase tracking-wider text-xs">Payment & Summary</h3>
                    </div>
                    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4">
                        <div className="flex justify-between items-center bg-gray-50/10 p-3 rounded-2xl border border-dashed border-gray-200">
                            <span className="text-sm font-bold text-gray-700">Cash on Delivery</span>
                            <CheckCircle2 className="text-primary-600" size={18} />
                        </div>

                        <div className="space-y-2 px-1">
                            <div className="flex justify-between text-sm text-gray-500 font-medium">
                                <span>Items ({cartItems.length})</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500 font-medium">
                                <span>Delivery</span>
                                <span>₹25.00</span>
                            </div>
                            <div className="h-px bg-gray-100 my-2"></div>
                            <div className="flex justify-between text-lg font-bold text-gray-900">
                                <span>To Pay</span>
                                <span className="text-primary-600">₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <button
                    type="submit"
                    disabled={loading || cartItems.length === 0}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-primary-100 active:scale-95 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : "Confirm Order"}
                </button>
            </form>
        </div>
    );
};

export default Checkout;
