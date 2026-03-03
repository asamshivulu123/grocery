import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <div className="flex bg-slate-100/30 min-h-screen">
                <Sidebar />
                <Dashboard />
              </div>
            </ProtectedRoute>
          } />

          <Route path="/products" element={
            <ProtectedRoute>
              <div className="flex bg-slate-100/30 min-h-screen">
                <Sidebar />
                <Products />
              </div>
            </ProtectedRoute>
          } />

          <Route path="/orders" element={
            <ProtectedRoute>
              <div className="flex bg-slate-100/30 min-h-screen">
                <Sidebar />
                <Orders />
              </div>
            </ProtectedRoute>
          } />

          <Route path="/analytics" element={
            <ProtectedRoute>
              <div className="flex bg-slate-100/30 min-h-screen">
                <Sidebar />
                <div className="p-8 pl-72 flex-1 flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-sm">
                  Full Analytics Coming Soon in v1.1
                </div>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
