import React from "react";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

export default function MapPage() {
    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <iframe src={`${BACKEND}/map/smp/`} title="Server Map" style={{ width: '100%', height: '100%', border: 'none' }} />
            <button style={{ ...btnStyle('#181818'), position: 'fixed', top: 50, right: 8, zIndex: 1000 }}><a style={{textDecoration: 'none', color: '#aaaaaa'}} href="/map/smp/areas">Draw Your Area ➝]</a></button>
        </div>
    );
}

function btnStyle(color: string, disabled = false) {
    return {
        padding: '8px 16px',
        borderRadius: 6,
        border: 'none',
        fontWeight: 600,
        fontSize: 14,
        color: '#fff',
        background: disabled ? '#444' : color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'background 0.15s ease',
    };
}