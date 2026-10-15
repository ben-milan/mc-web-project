import {useEffect, useState} from "react";

export default function AreasAdminPage() {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchAreas() {
        setLoading(true);
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/areas`);
        setAreas(await res.json());
        setLoading(false);
    }

    useEffect(() => { fetchAreas(); }, []);

    async function handleDelete(username) {
        if (!window.confirm(`Delete ${username}'s area?`)) return;

        const accessToken = localStorage.getItem("access_token");

        console.log('token being sent:', accessToken);
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/areas/${username}`, {
            method: "DELETE",
            headers: {'Authorization': `Bearer ${accessToken}`},
        });

        if (res.ok) {
            fetchAreas();
        } else {
            const body = await res.json().catch(() => ({}));
            console.error('Delete failed:', res.status, body);
            alert(`Delete failed (${res.status}): ${body.message ?? 'unknown error'}`);
        }
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: 24 }}>
            <h2>Player Areas</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th style={thStyle}>Username</th>
                    <th style={thStyle}>Color</th>
                    <th style={thStyle}>Area (blocks²)</th>
                    <th style={thStyle}>Saved</th>
                    <th style={thStyle}></th>
                </tr>
                </thead>
                <tbody>
                {areas.map((a) => (
                    <tr key={a.username}>
                        <td style={tdStyle}>{a.username}</td>
                        <td style={tdStyle}>
                            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 4, background: a.color }} />
                        </td>
                        <td style={tdStyle}>{a.area.toFixed(0)}</td>
                        <td style={tdStyle}>{new Date(a.savedAt).toLocaleString()}</td>
                        <td style={tdStyle}>
                            <button onClick={() => handleDelete(a.username)} style={deleteBtn}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {areas.length === 0 && <p>No areas saved yet.</p>}
        </div>
    );
}

const thStyle = { textAlign: 'left', borderBottom: '1px solid #444', padding: '8px 12px' };
const tdStyle = { borderBottom: '1px solid #222', padding: '8px 12px' };
const deleteBtn = { padding: "1px 2px" ,color: 'white', backgroundColor: '#293349', border: '1px solid #444', borderRadius: '5px', cursor: 'pointer' };