import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// @ts-ignore
import bluemap from "../img/map.png"

const CALIBRATION = {
    originX: -4031.367,
    scaleX: 3.690207,
    originZ: 3232.10,
    scaleZ: -3.690207,
};

function pixelToWorld(px: number, py: number) {
    return {
        x: CALIBRATION.originX + px * CALIBRATION.scaleX,
        z: CALIBRATION.originZ + py * CALIBRATION.scaleZ,
    }
}

function worldToPixel(x: number, z: number) {
    return {
        px: (x - CALIBRATION.originX) / CALIBRATION.scaleX,
        py: (z - CALIBRATION.originZ) / CALIBRATION.scaleZ,
    }
}

function calculateArea(points: any) {
    let sum = 0;
    const n = points.length;
    for (let i = 0; i < n; i++) {
        const { x: x1, z: z1 } = points[i];
        const { x: x2, z: z2 } = points[(i + 1) % n];
        sum += x1 * z2 - x2 * z1;
    }
    return Math.abs(sum) / 2;
}

async function saveArea({ username, points, area }) {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/areas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, points, area }),
    });
    return { ok: res.ok };
}

const CLOSE_THRESHOLD_PX = 15; // screen pixels, not world units — zoom-independent

export default function AreasPage() {
    const mapRef = useRef(null);
    const containerRef = useRef(null);
    const drawLayerRef = useRef(null);

    const [points, setPoints] = useState([]);
    const [drawing, setDrawing] = useState(false);
    const [awaitingSave, setAwaitingSave] = useState(false);
    const [username, setUsername] = useState('');
    const [saving, setSaving] = useState(false);

    const savedLayerRef = useRef(null);
    const [savedAreas, setSavedAreas] = useState([]);
    const [showAreas, setShowAreas] = useState(true);

    const pointsRef = useRef(points);
    const drawingRef = useRef(drawing);
    pointsRef.current = points;
    drawingRef.current = drawing;

    function finishDrawing(pts) {
        if (pts.length < 3) {
            alert('You need at least 3 points to close a shape.');
            return;
        }
        setDrawing(false);
        setAwaitingSave(true);
    }

    useEffect(() => {
        if (mapRef.current) return;

        const map = L.map(containerRef.current, {
            crs: L.CRS.Simple,
            minZoom: -2,
            zoomSnap: 0,
            maxZoom: 2,
        });

        const IMAGE_WIDTH = 2185;
        const IMAGE_HEIGHT = 1743;
        const bounds = [[0, 0], [IMAGE_HEIGHT, IMAGE_WIDTH]];

        L.imageOverlay(bluemap, bounds).addTo(map);
        map.fitBounds(bounds);
        map.setZoom(-0.85);

        drawLayerRef.current = L.layerGroup().addTo(map);
        savedLayerRef.current = L.layerGroup().addTo(map);
        fetchAreas();

        map.on('click', (e) => {
            console.log('pixel:', e.latlng.lng.toFixed(1), e.latlng.lat.toFixed(1));
        });

        map.on('click', (e) => {
            if (!drawingRef.current) return;
            const currentPoints = pointsRef.current;

            // Check if click is near the start point (screen-pixel distance, zoom-independent)
            if (currentPoints.length >= 3) {
                const first = currentPoints[0];
                const { px, py } = worldToPixel(first.x, first.z);
                const firstScreenPt = map.latLngToContainerPoint([py, px]);
                const clickScreenPt = map.latLngToContainerPoint(e.latlng);

                if (firstScreenPt.distanceTo(clickScreenPt) < CLOSE_THRESHOLD_PX) {
                    finishDrawing(currentPoints);
                    return;
                }
            }

            const world = pixelToWorld(e.latlng.lng, e.latlng.lat);
            setPoints((prev) => [...prev, world]);
        });

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    useEffect(() => {
        const layer = drawLayerRef.current;
        if (!layer) return;
        layer.clearLayers();

        const pixelPoints = points.map((p) => {
            const { px, py } = worldToPixel(p.x, p.z);
            return [py, px];
        });

        pixelPoints.forEach((pt, i) => {
            const isStart = i === 0;
            L.circleMarker(pt, {
                radius: isStart && points.length >= 3 ? 8 : 5,
                color: isStart ? '#ffcc00' : '#3388ff',
                weight: isStart ? 3 : 2,
            }).addTo(layer);
        });

        if (pixelPoints.length >= 2) {
            if (drawing) {
                // still drawing — open line only, no closing segment yet
                L.polyline(pixelPoints, { color: '#3388ff' }).addTo(layer);
            } else {
                // finished — polygon auto-closes last point back to first
                L.polygon(pixelPoints, { color: '#3388ff', fillOpacity: 0.25 }).addTo(layer);
            }
        }
    }, [points, drawing]);

    useEffect(() => {
        const layer = savedLayerRef.current;
        if (!layer) return;
        layer.clearLayers();

        savedAreas.forEach((area) => {
            const pixelPoints = area.points.map((p) => {
                const { px, py } = worldToPixel(p.x, p.z);
                return [py, px];
            });

            L.polygon(pixelPoints, {
                color: area.color,
                fillColor: area.color,
                fillOpacity: 0.3,
                weight: 2,
            })
                .bindTooltip(area.username, {
                    permanent: true,
                    direction: 'center',
                    className: 'area-label'
                })
                .addTo(layer);
        });
    }, [savedAreas]);

    useEffect(() => {
        const map = mapRef.current;
        const layer = savedLayerRef.current;
        if (!map || !layer) return;

        if (showAreas) {
            map.addLayer(layer);
        } else {
            map.removeLayer(layer);
        }
    }, [showAreas]);

    function startDrawing() {
        setPoints([]);
        setDrawing(true);
        setAwaitingSave(false);
        setUsername('');
    }

    function undoLast() {
        setPoints((prev) => prev.slice(0, -1));
    }

    function cancelDrawing() {
        setPoints([]);
        setDrawing(false);
        setAwaitingSave(false);
    }

    async function confirmSave() {
        if (!username.trim()) {
            alert('Enter your Minecraft username.');
            return;
        }
        setSaving(true);
        const area = calculateArea(points);
        const result = await saveArea({ username: username.trim(), points, area });
        setSaving(false);

        if (result.ok) {
            setPoints([]);
            setAwaitingSave(false);
            setUsername('');
            fetchAreas();
        } else {
            alert('Save failed - try again.')
        }
    }

    async function fetchAreas() {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/areas`);
            const data = await res.json();
            setSavedAreas(data);
        } catch (err) {
            console.error('failed to load areas', err);
        }
    }
    const liveArea = points.length >= 3 ? calculateArea(points) : 0;

    return (
        <>
            <div
                ref={containerRef}
                style={{ width: '100%', height: '100vh', background: '#111' }}
            />
            {!awaitingSave && (<div
                style={{
                    position: 'fixed',
                    top: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000,
                    display: 'flex',
                    gap: 10,
                    background: 'rgba(20, 20, 20, 0.25)',
                    padding: '10px 14px',
                    borderRadius: 10,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
                    backdropFilter: 'blur(4px)',
                }}
            >
                {!drawing ? (
                    <button style={btnStyle('#3388ff')} onClick={startDrawing}>
                        Draw Area
                    </button>
                ) : (
                    <>
                        <button
                            style={btnStyle('#555', points.length === 0)}
                            onClick={undoLast}
                            disabled={points.length === 0}
                        >
                            Undo Point
                        </button>
                        <button
                            style={btnStyle('#2ecc71', points.length < 3)}
                            onClick={() => finishDrawing(points)}
                            disabled={points.length < 3}
                        >
                            Finish Shape
                        </button>
                        <button style={btnStyle('#e74c3c')} onClick={cancelDrawing}>
                            Cancel
                        </button>
                    </>
                )}
            </div>
            )}
            {awaitingSave && (
                <div style={{
                        position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
                        zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 10,
                        background: 'rgba(20, 20, 20, 0.25)', padding: '16px 20px',
                        borderRadius: 10, boxShadow: '0 4px 14px rgba(0,0,0,0.35)', minWidth: 260,
                    }}
                >
                    <div style={{ color: '#fff', fontSize: 14}}>
                        Area: <strong>~{liveArea.toFixed(0)}</strong> blocks²
                    </div>
                    <input value={username}
                           onChange={(e: any) => setUsername(e.target.value)}
                           placeholder='Minecraft username'
                           style={{padding: '8px 10px', borderRadius: 6, border: 'none', fontSize: 14 }}
                    />
                    <div style={{ display: 'flex', gap: 8}}>
                        <button style={btnStyle('#2ecc71', saving)} onClick={confirmSave} disabled={saving}>
                            {saving ? 'Saving...' : 'Save Area'}
                        </button>
                        <button style={btnStyle('#e74c3c')} onClick={cancelDrawing}>Discard</button>
                    </div>
                </div>
            )}

            {!drawing && !awaitingSave && (
                <button
                    style={{ ...btnStyle(showAreas ? '#3388ff' : '#555'), position: 'fixed', top: 16, right: 16, zIndex: 1000 }}
                    onClick={() => setShowAreas((v) => !v)}
                >
                    {showAreas ? 'Hide Areas' : 'Show Areas'}
                </button>
            )}
            <button style={{ ...btnStyle('#3388ff'), position: 'fixed', top: 64, right: 16, zIndex: 1000 }}><a style={{textDecoration: 'none', color: '#fff'}} href="/map/smp">Live Map ➝]</a></button>
        </>
    );
}

function btnStyle(color, disabled = false) {
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