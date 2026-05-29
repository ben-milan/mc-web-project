import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export default function RequireAdmin() {
    const { token, role } = useAuth();
    if (!token) return <Navigate to="/login" replace />;
    if (role !== 'admin') return <Navigate to="/" replace />;
    return <Outlet />;
}