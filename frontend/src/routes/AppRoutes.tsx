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

// @ts-ignore
import BlueMapPage from "../pages/blueMap.tsx"
// @ts-ignore
import AreasPage from "../pages/AreasPage.tsx";
// @ts-ignore
import AreasAdminPage from "../pages/AreasAdminPage.tsx";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>

                    {/* Public */}
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/map/smp" element={<BlueMapPage />} />
                        <Route path="/map/smp/areas" element={<AreasPage />} />
                    </Route>

                    {/* Admin — protected */}
                    <Route element={<RequireAdmin />}>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="server" element={<ServerManagementPage />} />
                            <Route path="/admin/areas" element={<AreasAdminPage />} />
                        </Route>
                    </Route>

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}