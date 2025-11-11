import React from "react";

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
    <div className={className}>
      <table>
        <tr>
          <th>Server Name</th>
          <th>State</th>
          <th>IP</th>
        </tr>
        <tr>
          <td>{serverName}</td>
          <td>{serverState}</td>
          <td>{serverIP}</td>
        </tr>
      </table>
    </div>
  );
}

export default ServerStats;
