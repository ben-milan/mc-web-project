import React, {useRef, useState, useEffect, useLayoutEffect} from "react";
// @ts-ignore
import classes from "./ServerConsole.module.css"

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const MAX_LINES = 1000; // cap so a long-running server doesn't grow this unbounded

interface LogLine {
    id: number;
    text: string;
    color?: string;
}

interface ServerConsoleProps {
    path: string;
    server: string;
}

export default function ServerConsole({
                                          path, server
                                      }: ServerConsoleProps) {

    const consoleRef = useRef<HTMLDivElement>(null);
    const windowRef = useRef<HTMLDivElement>(null);
    const dragState = useRef({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0 });
    const nextIdRef = useRef(0);

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [lines, setLines] = useState<LogLine[]>([]);
    const [command, setCommand] = useState("");
    const [connectionKey, setConnectionKey] = useState(0);

    interface CmdResponse {
        response?: string;
        success?: boolean;
    }

    type CmdResult =
        | { ok: true; data: CmdResponse }
        | { ok: false };

// Generic helper: POST to an endpoint, log a message, and return whether it succeeded (+ parsed body).
    const postCmd = async (
        endpoint: string,
        body: object,
        startingMsg: string,
        failLabel: string
    ): Promise<CmdResult> => {
        if (startingMsg) {
            setLines(prev => [
                ...prev,
                { id: nextIdRef.current++, text: startingMsg, color: "#597EAA" },
            ]);
        }

        try {
            const res = await fetch(`${BACKEND}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                const data = await res.json().catch(() => ({} as CmdResponse));
                return { ok: true, data };
            }

            const responseBody = await res.text().catch(() => "");
            setLines(prev => [
                ...prev,
                { id: nextIdRef.current++, text: `[${failLabel} failed: ${res.status} ${responseBody}]` }
            ]);
            return { ok: false };
        } catch (err) {
            setLines(prev => [
                ...prev,
                { id: nextIdRef.current++, text: `[${failLabel} request failed: ${err}]` }
            ]);
            return { ok: false };
        }
    };

    // Shared "start" logic used by both `start` and `restart`
    const startServer = async (): Promise<boolean> => {
        const result = await postCmd(
            "/start-server",
            { server },
            "Server is starting...",
            "start-server"
        );
        if (result.ok) setConnectionKey(k => k + 1);
        return result.ok;
    };

    const handleCmd = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;

        const cmd = command.trim();
        setCommand("");

        if (cmd === "start") {
            await startServer();
        } else if (cmd === "restart") {
            const saved = await postCmd(
                "/cmd",
                { server, cmd: "save-all" },
                "Saving the server...",
                "save-all"
            );
            if (!saved.ok) return;

            const stopped = await postCmd(
                "/cmd",
                { server, cmd: "stop" },
                "Server is shutting down...",
                "stopping-server"
            );
            if (!stopped.ok) return;

            await startServer();
        } else {
            const command = await postCmd(
                "/cmd",
                { server, cmd }, "", "command"
            )
            if (!command.ok) return;

            if (command.data.success && command.data.response) {
                setLines(prev => [
                    ...prev,
                    { id: nextIdRef.current++, text: command.data.response!, color: "#597EAA"  },
                ])
            }
        }
    };

    useLayoutEffect(() => {
        if (!consoleRef.current) return;
        const parent = consoleRef.current.parentElement;
        if (!parent) return;

        const parentRect = parent.getBoundingClientRect();
        const consoleRect = consoleRef.current.getBoundingClientRect();

        const centeredX = (parentRect.width - consoleRect.width) / 2;
        const centeredY = (parentRect.height - consoleRect.height) / 2;

        setPosition({ x: centeredX, y: centeredY });
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        dragState.current = {
            dragging: true,
            startX: e.clientX,
            startY: e.clientY,
            origX: position.x,
            origY: position.y,
        };
        e.preventDefault();
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragState.current.dragging || !consoleRef.current) return;

            const parent = consoleRef.current.parentElement;
            if (!parent) return;

            const deltaX = e.clientX - dragState.current.startX;
            const deltaY = e.clientY - dragState.current.startY;

            let newX = dragState.current.origX + deltaX;
            let newY = dragState.current.origY + deltaY;

            const parentRect = parent.getBoundingClientRect();
            const consoleRect = consoleRef.current.getBoundingClientRect();

            const minX = 0;
            const minY = 0;
            const maxX = parentRect.width - consoleRect.width;
            const maxY = parentRect.height - consoleRect.height;

            newX = Math.min(Math.max(newX, minX), maxX);
            newY = Math.min(Math.max(newY, minY), maxY);

            setPosition({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            dragState.current.dragging = false;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        fetch(`${BACKEND}/status`)
            .then(res => res.json())
            .then(data => {
                if (!cancelled && data?.[server]?.status === "online") {
                    setConnectionKey(k => (k === 0 ? 1 : k));
                }
            })
            .catch(() => {});

        return () => { cancelled = true; };
    }, [server]);

    // --- streaming logic ---
    useEffect(() => {
        if (connectionKey === 0) return;

        nextIdRef.current += 1; // keep ids unique across reconnects
        setLines(prev => {
            const next = [
                ...prev,
                { id: nextIdRef.current++, text: "--- connecting to log stream ---", color: "#666666" }
            ];
            return next.length > MAX_LINES ? next.slice(next.length - MAX_LINES) : next;
        });

        const es = new EventSource(`${BACKEND}/logs/${server}`);

        es.onmessage = (e) => {
            setLines(prev => {
                const next = [...prev, { id: nextIdRef.current++, text: e.data }];
                return next.length > MAX_LINES
                    ? next.slice(next.length - MAX_LINES)
                    : next;
            });
        };

        es.onerror = () => {
            setLines(prev => [
                ...prev,
                { id: nextIdRef.current++, text: "--- connection lost - retrying ---", color: "#666666" }
            ]);
        };

        return () => es.close();
    }, [server, connectionKey]);

    // auto-scroll to bottom whenever new lines arrive
    useEffect(() => {
        if (windowRef.current) {
            windowRef.current.scrollTop = windowRef.current.scrollHeight;
        }
    }, [lines]);
    // --- end streaming logic ---

    return (
        <div
            ref={consoleRef}
            className={`${classes.console}`}
            style={{
                position: "absolute",
                left: position.x,
                top: position.y,
            }}
        >
            <div
                className={`${classes.consoleHeader}`}
                onMouseDown={handleMouseDown}
            >
                <p>{path}</p>
                <div className={classes.trafficLight}>
                    <span className={`${classes.dot} ${classes.red}`}>
                        <svg viewBox="0 0 8 8" width="6" height="6">
                            <path d="M1,1 L7,7 M7,1 L1,7" stroke="#4d0000" strokeWidth="2" />
                        </svg>
                    </span>
                    <span className={`${classes.dot} ${classes.yellow}`}>
                        <svg viewBox="0 0 8 8" width="6" height="6">
                            <path d="M1,4 L7,4" stroke="#7a5200" strokeWidth="2" />
                        </svg>
                    </span>
                    <span className={`${classes.dot} ${classes.green}`}>
                        <svg viewBox="0 0 8 8" width="6" height="6">
                            <path d="M1,4 L3,4 M3,4 L3,2 M5,4 L7,4 M5,4 L5,6" stroke="#0a4d0a" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </span>
                </div>
            </div>
            <div className={`${classes.consoleWindow}`} ref={windowRef}>
                {lines.map(line => (
                    <p key={line.id } style={line.color ? { color: line.color } : undefined}>{line.text}</p>
                ))}
            </div>
            <div className={`${classes.consoleInput}`}>
                <span>{">"}</span>
                <input
                    type="text"
                    placeholder="Enter Command..."
                    name="command"
                    id="command"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={handleCmd}
                />
            </div>
        </div>
    )
}