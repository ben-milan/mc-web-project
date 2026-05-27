import {BrowserRouter, Routes, Route} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import AdminDashboard from "../pages/AdminDashboard";
import AdminLayout from "../layouts/AdminLayout";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Routes */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                </Route>

                {/* Admin routes (protected by Phase 4) */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                </Route>

            </Routes>
        </BrowserRouter>
    )
}