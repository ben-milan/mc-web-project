import { JSX, useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
// @ts-ignore
import { useAuth } from '../auth/AuthProvider.tsx';
// @ts-ignore
import classes from './AdminLayout.module.css';
// @ts-ignore
import ServerConsole from "../components/ServerConsole.tsx";

const BACKEND = process.env.REACT_APP_BACKEND_URL

const SERVER_COMPONENTS: Record<string, JSX.Element> = {
    smp: <ServerConsole path="C:\Server\smp-server\logs\latest.log" server="smp-server" />,
    mod: <ServerConsole path="C:\Server\mod-server\logs\latest.log" server="mod-server" />,
    dev: <ServerConsole path="C:\Server\dev-server\logs\latest.log" server="dev-server" />,
};

// ... rest of your file unchanged

function ServerDropdown({ onSelect, selected }: { onSelect: (key: string) => void, selected: string | null }) {
    const [open, setOpen] = useState(false);
    const isActive = selected !== null;

    return (
        <div>
            <button
                className={`${classes.navDropdown} ${isActive ? classes.active : ''}`}
                onClick={() => setOpen(o => !o)}
            >
                Server Management
                <span className={`${classes.chevron} ${open ? classes.chevronOpen : ''}`}>▾</span>
            </button>
            <div className={`${classes.dropdownChildren} ${open ? classes.open : ''}`}>
                <button onClick={() => onSelect('smp')} className={selected === 'smp' ? classes.active : ''}>SMP-Server</button>
                <button onClick={() => onSelect('mod')} className={selected === 'mod' ? classes.active : ''}>Mod-Server</button>
                <button onClick={() => onSelect('dev')} className={selected === 'dev' ? classes.active : ''}>Dev-Server</button>
            </div>
        </div>
    );
}

export default function AdminLayout() {
    const { logout } = useAuth();
    const [selectedServer, setSelectedServer] = useState<string | null>(null);
    const [openedServers, setOpenedServers] = useState<Set<string>>(new Set());

    const handleSelect = (key: string) => {
        setSelectedServer(key);
        setOpenedServers(prev => (prev.has(key) ? prev : new Set(prev).add(key)));
    };

    return (
        <div className={classes.adminLayout}>
            <aside className={classes.adminSidebar}>
                <h1>Admin Panel</h1>
                <nav>
                    <NavLink to="/admin" end onClick={() => setSelectedServer(null)}>Dashboard</NavLink>
                    <NavLink to="/admin/areas" end onClick={() => setSelectedServer(null)}>Areas Management</NavLink>
                    <ServerDropdown onSelect={handleSelect} selected={selectedServer} />
                </nav>
                <button className={classes.logoutBtn} onClick={logout}>Logout</button>
            </aside>
            <main className={classes.adminContent}>
                {[...openedServers].map(key => (
                    <div
                        key={key}
                        className={classes.centeredContent}
                        style={{ display: key === selectedServer ? 'block' : 'none' }}
                    >
                        {SERVER_COMPONENTS[key]}
                    </div>
                ))}
                {!selectedServer && <Outlet />}
            </main>
        </div>
    );
}