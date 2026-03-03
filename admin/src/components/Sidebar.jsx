import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Settings, BarChart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout, admin } = useAuth();

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 sidebar-gradient text-slate-300 flex flex-col p-6 z-50">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-500/20">
                    G
                </div>
                <div>
                    <h2 className="text-white font-bold tracking-tight">Grocery Admin</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Management</p>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) => `flex items-center gap-3 p-3.5 rounded-xl transition-all font-medium border-l-4 ${isActive ? 'bg-primary-500/10 text-white border-primary-500' : 'hover:bg-slate-800 border-transparent text-slate-400'}`}
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink
                    to="/products"
                    className={({ isActive }) => `flex items-center gap-3 p-3.5 rounded-xl transition-all font-medium border-l-4 ${isActive ? 'bg-primary-500/10 text-white border-primary-500' : 'hover:bg-slate-800 border-transparent text-slate-400'}`}
                >
                    <Package size={20} />
                    <span>Products</span>
                </NavLink>
                <NavLink
                    to="/orders"
                    className={({ isActive }) => `flex items-center gap-3 p-3.5 rounded-xl transition-all font-medium border-l-4 ${isActive ? 'bg-primary-500/10 text-white border-primary-500' : 'hover:bg-slate-800 border-transparent text-slate-400'}`}
                >
                    <ShoppingCart size={20} />
                    <span>Orders</span>
                </NavLink>
                <NavLink
                    to="/analytics"
                    className={({ isActive }) => `flex items-center gap-3 p-3.5 rounded-xl transition-all font-medium border-l-4 ${isActive ? 'bg-primary-500/10 text-white border-primary-500' : 'hover:bg-slate-800 border-transparent text-slate-400'}`}
                >
                    <BarChart size={20} />
                    <span>Analytics</span>
                </NavLink>
            </nav>

            <div className="pt-6 border-t border-slate-800 mt-auto">
                <div className="p-3 bg-slate-800/40 rounded-2xl mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white uppercase">{admin?.name[0]}</div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-white truncate">{admin?.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">Administrator</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 p-3.5 w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
