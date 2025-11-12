import React, { useState, useEffect } from "react";
import "./App.css";
import Requirements from "./components/Requirements.tsx";

import ServerInfo from "./components/ServerInfo.tsx";

import ServerStats from "./components/ServerStats.tsx";

function App() {

 

  const [pos, setPos] = useState({ x: 0, y: 0 });

  const [modServerState, setModServerState] =  useState("🔴 Server Offline")
  const [smpServerState, setSmpServerState] =  useState("🔴 Server Offline")

  const snappedX = Math.round(pos.x / 7) * 7;
  const snappedY = Math.round(pos.y / 7) * 7;

  useEffect(() => {
    const API_URL = process.env.REACT_APP_STATUS_URL;
  
    async function fetchServerStatus() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch server status");
  
        const data = await res.json();
        console.log("Server status data:", data);
  
        // Map backend status to frontend state
        setModServerState(
          data["mod-server"]?.status === "offline"
            ? "🔴 Server Offline"
            : "🟢 Server Online"
        );
  
        setSmpServerState(
          data["smp-server"]?.status === "offline"
            ? "🔴 Server Offline"
            : "🟢 Server Online"
        );
  
        // If you want to also track dev-server status, you can add another state
        // setDevServerState(
        //   data["dev-server"]?.status === "offline"
        //     ? "🔴 Server Offline"
        //     : "🟢 Server Online"
        // );
  
      } catch (err) {
        console.error("Error fetching server state:", err);
        // Optional: fallback to offline if fetch fails
        setModServerState("🔴 Server Offline");
        setSmpServerState("🔴 Server Offline");
      }
    }
  
    fetchServerStatus();
  }, []);

  return (
    <div
      className="background"
      onMouseMove={(e) =>
        setPos({ x: e.clientX, y: e.clientY })
      }
    >
      <div
        className="color-layer"
        style={{
          WebkitMaskImage: `radial-gradient(circle 800px at ${snappedX}px ${snappedY}px, black 0%, transparent 100%)`,
          WebkitMaskRepeat: "no-repeat",
          maskImage: `radial-gradient(circle 800px at ${snappedX}px ${snappedY}px, black 0%, transparent 100%)`,
          maskRepeat: "no-repeat",
        }}
      />
      <div className="content">
        <div className="content">
          <ServerInfo className="server-info" requirements={<Requirements items={[{ title: "Minecraft: ", display: "Latest Release", link:"https://minecraft.wiki/w/Java_Edition_version_history#Full_release"}]} />} buttonName="Start Server" serverName="Dev-Server" serverDescription="This server is mainly used for developing and testing plugins, mods, and other custom add-ons for the base game." />
          <ServerInfo className="server-info" onStateChange={setModServerState} buttonName="Not Available" serverName="Mod-Server" serverDescription="Welcome to a modded Minecraft server with a custom modpack. Dive in and enjoy exploring! " />
          <ServerInfo className="server-info" onStateChange={setSmpServerState} buttonName="Start Server" serverName="SMP-Server" serverDescription="Want all the latest features? Jump into the worlds of the always-up-to-date vanilla SMP."/>
        </div>
      </div>
      <div className="content-stats">
        <ServerStats
          serverIP="51.154.202.221:25567"
          serverName="SMP-Server"
          serverState={smpServerState}
          className="server-stats"
        />
        <ServerStats
          serverIP="51.154.202.221:25566"
          serverName="Mod-Server"
          serverState={modServerState}
          className="server-stats"
        />
      </div>
    </div>
    
  );
}

export default App;
