interface  DashboardWidget {
    icon: string;
    sensorId: string;
    title?: string;
}

export const Dashboard: DashboardWidget[] = [
    {
        icon: "🌡",
        sensorId: "/intelcpu/0/temperature/1"
    },
    {
        icon: "🥛",
        sensorId: "/ram/data/0"
    },
    {
        icon: "🌡",
        sensorId: "/intelcpu/0/temperature/1"
    },
    {
        icon: "🌡",
        sensorId: "/intelcpu/0/temperature/1"
    },
    {
        icon: "🌡",
        sensorId: "/intelcpu/0/temperature/1"
    },
    {
        icon: "🌡",
        sensorId: "/intelcpu/0/temperature/1"
    },
]