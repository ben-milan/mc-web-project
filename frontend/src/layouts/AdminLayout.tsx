import { Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="admin-layout">
            <aside className={"admin-sidebar"}>
                <p>Admin Panel</p>
            </aside>
            <main className={"admin-content"}>
                <Outlet />
            </main>
        </div>
    )
}