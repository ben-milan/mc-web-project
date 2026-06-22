import { BrowserRouter, Routes, Route } from 'react-router-dom';
// @ts-ignore
import { AuthProvider } from '../auth/AuthProvider.tsx';
// @ts-ignore
import RequireAdmin from '../auth/RequireAdmin.tsx';

// @ts-ignore
import MainLayout from '../layouts/MainLayout.tsx';
// @ts-ignore
import AdminLayout from '../layouts/AdminLayout.tsx';

// @ts-ignore
import HomePage from '../pages/HomePage.tsx';
// @ts-ignore
import LoginPage from '../pages/LoginPage.tsx';
// @ts-ignore
import AdminDashboard from '../pages/AdminDashboard.tsx';
// @ts-ignore
import ServerManagementPage from "../pages/ServerManagementPage.tsx";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>

                    {/* Public */}
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                    </Route>

                    {/* Admin — protected */}
                    <Route element={<RequireAdmin />}>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="server" element={<ServerManagementPage />} />
                        </Route>
                    </Route>

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}