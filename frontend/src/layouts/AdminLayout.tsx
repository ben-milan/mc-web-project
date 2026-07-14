import { JSX, useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
// @ts-ignore
import { useAuth } from '../auth/AuthProvider.tsx';
// @ts-ignore
import classes from './AdminLayout.module.css';

const BACKEND = process.env.REACT_APP_BACKEND_URL

function SmpServerTest() {
    const [data, setData] = useState<string>('Connecting...');

    useEffect(() => {
        const es = new EventSource(`${ BACKEND }/stream`);

        es.onmessage = (e) => setData(e.data);
        es.onerror = () => setData('SSE error');

        return () => es.close();
    }, []);

    return <div>{data}</div>;
}

const SERVER_COMPONENTS: Record<string, JSX.Element> = {
    smp: <SmpServerTest />,
    mod: <div>Mod Server Component</div>,
    dev: <div>Dev Server Component</div>,
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

    return (
        <div className={classes.adminLayout}>
            <aside className={classes.adminSidebar}>
                <h1>Admin Panel</h1>
                <nav>
                    <NavLink to="/admin" end onClick={() => setSelectedServer(null)}>Dashboard</NavLink>
                    <ServerDropdown onSelect={setSelectedServer} selected={selectedServer} />
                </nav>
                <button className={classes.logoutBtn} onClick={logout}>Logout</button>
            </aside>
            <main className={classes.adminContent}>
                {selectedServer ? SERVER_COMPONENTS[selectedServer] : <Outlet />}
            </main>
        </div>
    );
}