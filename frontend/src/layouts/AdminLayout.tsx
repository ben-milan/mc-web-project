import { Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function AdminLayout() {
    const { logout } = useAuth();

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <p>Admin Panel</p>
                <button onClick={logout}>Logout</button>
            </aside>
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}