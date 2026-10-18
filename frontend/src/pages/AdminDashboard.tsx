// @ts-ignore
import classes from "./AdminDashboard.module.css"
// @ts-ignore
import {useServerMetrics} from "../hooks/useServerMetrics.tsx";
// @ts-ignore
import {Dashboard} from "../config/Dashboard.tsx";
// @ts-ignore
import AdminWidget from "../components/AdminWidget.tsx";

export default function AdminDashboard() {
    const sensors = useServerMetrics();

    return (
        <div className={`${classes.widgetGrid}`}>
            {Dashboard.map(widget => {

                const sensor = sensors.find(s => s.sensor_id === widget.sensorId);

                if (!sensor) return null;

                return (
                    <AdminWidget icon={widget.icon} sensor={sensor} title={widget.title} />
                );
            })}
        </div>
    );
}