import { useEffect, useState } from "react";
import { Sensor } from "../types/Sensor";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

export function useServerMetrics() {
    const [sensors, setSensors] = useState<Sensor[]>([]);

    useEffect(() => {
        const es = new EventSource(`${BACKEND}/stream`);

        es.onmessage = (event) => {
            setSensors(JSON.parse(event.data));
        };

        return () => es.close();
    }, []);

    return sensors;
}