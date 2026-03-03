import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Loader2, PlusCircle } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-[90vh] justify-center px-4">
            <div className="mb-10 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-600">
                    <PlusCircle size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                <p className="text-gray-500 mt-2 font-medium">Join our community market today.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="p-3 bg-red-50 text-red-500 rounded-xl text-sm font-medium border border-red-100">{error}</div>}

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            required
                            placeholder="John Doe"
                            className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary-100 shadow-sm"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary-100 shadow-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                            type="password"
                            required
                            placeholder="Minimum 6 characters"
                            className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary-100 shadow-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-2xl mt-4 transition-all shadow-lg shadow-primary-200 active:scale-95 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign Up"}
                </button>
            </form>

            <p className="text-center text-gray-500 mt-8 font-medium">
                Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Login Now</Link>
            </p>
        </div>
    );
};

export default Register;
