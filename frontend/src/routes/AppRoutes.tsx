import {BrowserRouter, Routes, Route} from "react-router-dom";
// @ts-ignore
import MainLayout from "../layouts/MainLayout.tsx";
// @ts-ignore
import HomePage from "../pages/HomePage.tsx";
// @ts-ignore
import AdminDashboard from "../pages/AdminDashboard.tsx";
// @ts-ignore
import AdminLayout from "../layouts/AdminLayout.tsx";

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