import React from "react";
import {Sensor} from "../types/Sensor";
// @ts-ignore
import classes from "./AdminWidget.module.css"

interface AdminWidgetProps {
    icon: string;
    sensor: Sensor;
    title?: string;
}

export default function AdminWidget({
    icon,
    sensor,
    title,
    }: AdminWidgetProps) {

    return (
        <div className={`${classes.adminWidget}`}>
            <span>{icon}</span>
            <h1>{ title ?? sensor.name}</h1>
            <p>{sensor.value}</p>
        </div>
    )
}