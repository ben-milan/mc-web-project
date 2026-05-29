// @ts-ignore
import {useAuth} from "./AuthProvider.tsx";
import {Navigate, Outlet} from "react-router-dom";

export default function RequireAuth() {
    const { token } = useAuth();
    return token ? <Outlet /> : <Navigate to="/login" replace />;
}