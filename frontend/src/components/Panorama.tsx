// @ts-ignore
import classes from "./Panorama.module.css";
import { useEffect, useRef } from "react";

// @ts-ignore
const context = require.context("../vids/", true, /\.(mp4|jpe?g|png|webp)$/);

let videoSrc: string | undefined;
let posterSrc: string | undefined;

context.keys().forEach((key: string) => {
    if (/\/bg\.[a-zA-Z0-9]+$/.test(key)) videoSrc = context(key);
    if (/\/poster\.[a-zA-Z0-9]+$/.test(key)) posterSrc = context(key);
});

export default function Panorama() {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        function sync() {
            const el = videoRef.current;
            if (!el) return;
            if (!document.hidden && document.hasFocus()) {
                el.play().catch(() => {});
            } else {
                el.pause();
            }
        }
        sync();
        document.addEventListener("visibilitychange", sync);
        window.addEventListener("blur", sync);
        window.addEventListener("focus", sync);
        return () => {
            document.removeEventListener("visibilitychange", sync);
            window.removeEventListener("blur", sync);
            window.removeEventListener("focus", sync);
        };
    }, []);

    if (!videoSrc) return null;

    return (
        <div className={classes.panoramaRoot}>
            <video
                ref={videoRef}
                className={classes.video}
                src={videoSrc}
                poster={posterSrc}
                muted
                loop
                playsInline
                preload="auto"
            />
        </div>
    );
}