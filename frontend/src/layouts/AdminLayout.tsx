import {NavLink, Outlet} from 'react-router-dom';
// @ts-ignore
import { useAuth } from '../auth/AuthProvider.tsx';

export default function AdminLayout() {
    const { logout } = useAuth();

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <p>Admin Panel</p>
                <button onClick={logout}>Logout</button>
                <nav>
                    <NavLink to="/admin" end>Dashboard</NavLink>
                    <NavLink to="/admin/server">Server-Management</NavLink>
                </nav>
            </aside>
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}