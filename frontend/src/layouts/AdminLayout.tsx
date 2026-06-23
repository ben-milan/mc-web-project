import {JSX, useState} from 'react';
import { NavLink, Outlet } from 'react-router-dom';
// @ts-ignore
import { useAuth } from '../auth/AuthProvider.tsx';
// @ts-ignore
import classes from './AdminLayout.module.css';

// Import your server components
// import SmpServer from '../server/SmpServer.tsx';
// import ModServer from '../server/ModServer.tsx';
// import DevServer from '../server/DevServer.tsx';

const SERVER_COMPONENTS: Record<string, JSX.Element> = {
    smp: <div>SMP Server Component</div>, // Replace with <SmpServer />
    mod: <div>Mod Server Component</div>, // Replace with <ModServer />
    dev: <div>Dev Server Component</div>, // Replace with <DevServer />
};

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
    const [showOutlet, setShowOutlet] = useState(true);

    const handleNavLinkClick = () => {
        setSelectedServer(null);
        setShowOutlet(true);
    };

    const handleServerSelect = (key: string) => {
        setSelectedServer(key);
        setShowOutlet(false);
    };

    return (
        <div className={classes.adminLayout}>
            <aside className={classes.adminSidebar}>
                <h1>Admin Panel</h1>
                <nav>
                    <NavLink to="/admin" end onClick={handleNavLinkClick}>Dashboard</NavLink>
                    <ServerDropdown onSelect={handleServerSelect} selected={selectedServer} />
                </nav>
                <button className={classes.logoutBtn} onClick={logout}>Logout</button>
            </aside>
            <main className={classes.adminContent}>
                {selectedServer ? SERVER_COMPONENTS[selectedServer] : <Outlet />}
            </main>
        </div>
    );
}