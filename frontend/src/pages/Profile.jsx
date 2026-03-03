import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    User, Mail, LogOut, ChevronRight, Settings,
    Info, CreditCard, Lock, X, CheckCircle, Phone, MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

// --- Reusable Modal Shell ---
const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
        <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-5 border-b border-gray-50">
                <h3 className="font-black text-gray-900 text-base">{title}</h3>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                    <X size={20} />
                </button>
            </div>
            <div className="p-5">{children}</div>
        </div>
    </div>
);

// --- Change Password Modal ---
const ChangePasswordModal = ({ onClose }) => {
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) {
            setError("New passwords don't match.");
            return;
        }
        if (form.newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.put('/auth/change-password', {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });
            setSuccess(true);
            setTimeout(onClose, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title="Change Password" onClose={onClose}>
            {success ? (
                <div className="flex flex-col items-center py-6 text-center">
                    <CheckCircle size={48} className="text-green-500 mb-3" />
                    <p className="font-bold text-gray-800">Password changed!</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100">{error}</div>}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="password" required placeholder="••••••••"
                                className="w-full bg-gray-50 rounded-2xl py-3.5 pl-10 pr-4 border-none outline-none focus:ring-2 focus:ring-primary-400 text-sm font-medium"
                                value={form.currentPassword} onChange={e => setForm({ ...form, currentPassword: e.target.value })} />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="password" required placeholder="Min. 6 characters"
                                className="w-full bg-gray-50 rounded-2xl py-3.5 pl-10 pr-4 border-none outline-none focus:ring-2 focus:ring-primary-400 text-sm font-medium"
                                value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Confirm New Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="password" required placeholder="Re-enter new password"
                                className="w-full bg-gray-50 rounded-2xl py-3.5 pl-10 pr-4 border-none outline-none focus:ring-2 focus:ring-primary-400 text-sm font-medium"
                                value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
                        </div>
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full bg-primary-500 text-white font-bold py-4 rounded-2xl mt-2 active:scale-95 transition-all shadow-lg shadow-primary-200 disabled:opacity-60">
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            )}
        </Modal>
    );
};

// --- Payment Methods Modal ---
const PaymentModal = ({ onClose }) => (
    <Modal title="Payment Methods" onClose={onClose}>
        <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                    💵
                </div>
                <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm">Cash on Delivery</p>
                    <p className="text-xs text-gray-400 font-medium">Pay when your order arrives</p>
                </div>
                <CheckCircle size={18} className="text-primary-500" />
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                <p className="text-xs font-bold text-blue-600">💳 Card & UPI payments coming soon!</p>
            </div>
        </div>
    </Modal>
);

// --- Help & Support Modal ---
const HelpModal = ({ onClose }) => (
    <Modal title="Help & Support" onClose={onClose}>
        <div className="space-y-3">
            <a href="tel:+1800000000" className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-primary-50 transition-colors active:scale-95 border border-gray-100">
                <div className="p-2 bg-green-100 text-green-600 rounded-xl"><Phone size={18} /></div>
                <div>
                    <p className="font-bold text-gray-800 text-sm">Call Support</p>
                    <p className="text-xs text-gray-400 font-medium">Mon–Sat, 9am – 7pm</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 ml-auto" />
            </a>
            <a href="mailto:support@grocery.com" className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-primary-50 transition-colors active:scale-95 border border-gray-100">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Mail size={18} /></div>
                <div>
                    <p className="font-bold text-gray-800 text-sm">Email Us</p>
                    <p className="text-xs text-gray-400 font-medium">support@grocery.com</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 ml-auto" />
            </a>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-xl"><MessageSquare size={18} /></div>
                <div>
                    <p className="font-bold text-gray-800 text-sm">Live Chat</p>
                    <p className="text-xs text-gray-400 font-medium">Coming soon</p>
                </div>
            </div>
        </div>
    </Modal>
);

// --- Main Profile Component ---
const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeModal, setActiveModal] = useState(null); // 'password' | 'payment' | 'help'

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
            {/* Active Modals */}
            {activeModal === 'password' && <ChangePasswordModal onClose={() => setActiveModal(null)} />}
            {activeModal === 'payment' && <PaymentModal onClose={() => setActiveModal(null)} />}
            {activeModal === 'help' && <HelpModal onClose={() => setActiveModal(null)} />}

            {/* Avatar Section */}
            <div className="flex flex-col items-center justify-center py-6">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-primary-600 border-4 border-white shadow-xl shadow-primary-50">
                    <User size={48} />
                </div>
                <h2 className="text-2xl font-black text-gray-900">{user.name}</h2>
                <div className="flex items-center gap-1 text-gray-400 font-medium mt-1">
                    <Mail size={14} />
                    <span className="text-sm">{user.email}</span>
                </div>
                <div className="mt-3 bg-primary-50 px-3 py-1 rounded-full text-xs font-black text-primary-600 uppercase tracking-widest border border-primary-100/50">
                    {user.role} Account
                </div>
            </div>

            {/* Account Settings Section */}
            <div className="space-y-3">
                <h3 className="font-bold text-gray-800 uppercase tracking-wider text-xs px-2">Account Settings</h3>
                <div className="bg-white rounded-3xl p-2 border border-gray-100 shadow-sm space-y-1">

                    <button
                        onClick={() => setActiveModal('payment')}
                        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-2xl transition-all group active:scale-[0.98]"
                    >
                        <div className="p-2 bg-orange-50 text-orange-500 rounded-xl group-hover:bg-white transition-all shadow-sm">
                            <CreditCard size={18} />
                        </div>
                        <span className="flex-1 text-left font-bold text-gray-700">Payment Methods</span>
                        <ChevronRight size={18} className="text-gray-300" />
                    </button>

                    <button
                        onClick={() => setActiveModal('password')}
                        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-2xl transition-all group active:scale-[0.98]"
                    >
                        <div className="p-2 bg-blue-50 text-blue-500 rounded-xl group-hover:bg-white transition-all shadow-sm">
                            <Settings size={18} />
                        </div>
                        <span className="flex-1 text-left font-bold text-gray-700">Change Password</span>
                        <ChevronRight size={18} className="text-gray-300" />
                    </button>

                    <button
                        onClick={() => setActiveModal('help')}
                        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-2xl transition-all group active:scale-[0.98]"
                    >
                        <div className="p-2 bg-green-50 text-green-500 rounded-xl group-hover:bg-white transition-all shadow-sm">
                            <Info size={18} />
                        </div>
                        <span className="flex-1 text-left font-bold text-gray-700">Help & Support</span>
                        <ChevronRight size={18} className="text-gray-300" />
                    </button>
                </div>
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="w-full bg-white text-red-500 font-bold py-5 rounded-3xl border border-red-100 flex items-center justify-center gap-2 hover:bg-red-50 transition-all active:scale-95 shadow-sm"
            >
                <LogOut size={20} /> Log Out
            </button>
        </div>
    );
};

export default Profile;
