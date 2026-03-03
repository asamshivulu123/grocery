import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Access Denied. Ensure you have admin privileges.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen justify-center items-center px-6 bg-slate-100/50">
            <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 p-12 w-full max-w-lg border border-slate-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-primary-500"></div>
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-500 shadow-sm border border-primary-100">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Admin Portal</h2>
                    <p className="text-slate-500 mt-2 font-medium">Log in to manage your grocery store.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-100 text-center">{error}</div>}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                            <input
                                type="email"
                                required
                                placeholder="admin@community.com"
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-500 shadow-sm font-bold text-slate-700"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-500 shadow-sm font-bold text-slate-700"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-2xl mt-4 transition-all shadow-xl shadow-slate-300 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>Secure Login <ArrowRight size={18} /></>
                        )}
                    </button>
                </form>
            </div>

            <p className="mt-10 text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Hyperlocal Grocery Systems v1.0</p>
        </div>
    );
};

export default Login;
