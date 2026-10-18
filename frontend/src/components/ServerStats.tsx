// @ts-ignore
import React from "react";
// @ts-ignore
import classes from "../pages/HomePage.module.css"

interface ServerStatsProps {
  className?: string;
  serverName: string;
  serverState: string;
  serverIP: string;
  mapLink?: string;
}

function ServerStats({
                       className,
                       serverName,
                       serverState = "🔴 Server Offline",
                       serverIP,
                       mapLink,
                     }: ServerStatsProps) {
  const isOnline = serverState.includes("Online");
  const hasMap = Boolean(mapLink);

  return (
      <div className={`${classes[`${className}`]}`}>
        <table>
          <thead>
          <tr>
            <th>Server Name</th>
            <th>State</th>
            <th>IP</th>
              {hasMap && (
            <th>Map</th>
              )}
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{serverName}-Server</td>
            <td>{serverState}</td>
            <td>{serverIP}</td>
              {hasMap && (
            <td>
              <a
              className={`${classes.mapButton}`}
              rel="noreferrer"
              target="_self"
              style={{textDecoration: "none"}}
              href={!isOnline ? "./map/smp/areas" : mapLink}
              >
              {serverName}-Map
            </a>
          </td>
              )}
          </tr>
        </tbody>
      </table>
</div>
);
}

export default ServerStats;