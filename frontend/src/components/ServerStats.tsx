import React from "react";
// @ts-ignore
import classes from "../pages/HomePage.module.css"

interface ServerStatsProps {
  className?: string;
  serverName: string;
  serverState: string;
  serverIP: string;
}

function ServerStats({
  className,
  serverName,
  serverState = "🔴 Server Offline",
  serverIP,
}: ServerStatsProps) {
  return (
    <div className={`${classes[`${className}`]}`}>
      <table>
        <thead>
          <tr>
            <th>Server Name</th>
            <th>State</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{serverName}</td>
            <td>{serverState}</td>
            <td>{serverIP}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ServerStats;
