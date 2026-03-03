import { NavLink } from 'react-router-dom';
import { ShoppingCart, Home, List, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Layout = ({ children }) => {
    const { cartItems } = useCart();
    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Sticky Header */}
            <header className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-primary-100 p-4">
                <div className="flex justify-between items-center max-w-lg mx-auto">
                    <h1 className="text-2xl font-bold text-primary-600">HyperLocal</h1>
                    <div className="relative">
                        <NavLink to="/cart">
                            <ShoppingCart className="text-gray-600" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </NavLink>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 pb-20 p-4 max-w-lg mx-auto w-full">
                {children}
            </main>

            {/* Sticky Bottom Nav */}
            <nav className="sticky-bottom-nav">
                <NavLink
                    to="/"
                    className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? 'text-primary-600' : 'text-gray-400'}`}
                >
                    <Home size={24} />
                    <span>Home</span>
                </NavLink>
                <NavLink
                    to="/orders"
                    className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? 'text-primary-600' : 'text-gray-400'}`}
                >
                    <List size={24} />
                    <span>Orders</span>
                </NavLink>
                <NavLink
                    to="/profile"
                    className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? 'text-primary-600' : 'text-gray-400'}`}
                >
                    <User size={24} />
                    <span>Profile</span>
                </NavLink>
            </nav>
        </div>
    );
};

export default Layout;
