import React, { useState } from "react";
import "./App.css";
import Requirements from "./components/Requirements.tsx";

import ServerInfo from "./components/ServerInfo.tsx";

import ServerStats from "./components/ServerStats.tsx";

function App() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const snappedX = Math.round(pos.x / 7) * 7;
  const snappedY = Math.round(pos.y / 7) * 7;

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
          <ServerInfo className="server-info" requirements={<Requirements items={[{ title: "Minecraft: ", display: "Latest Release", link:"https://minecraft.wiki/w/Java_Edition_version_history#Full_release"}]} />} buttonName="Not Available" serverName="Dev-Server" serverDescription="This server is mainly used for developing and testing plugins, mods, and other custom add-ons for the base game." />
          <ServerInfo className="server-info" buttonName="Not Available" serverName="Mod-Server" serverDescription="Welcome to a modded Minecraft server with a custom modpack. Dive in and enjoy exploring! " />
          <ServerInfo className="server-info" buttonName="Not Available" serverName="SMP-Server" serverDescription="Want all the latest features? Jump into the worlds of the always-up-to-date vanilla SMP."/>
        </div>
        <div className="content-stats">
          <ServerStats serverIP="51.154.202.221:25567" serverName="SMP-Server" serverState="🟢 Server Online" className="server-stats"/>
          <ServerStats serverIP="51.154.202.221:25566" serverName="Mod-Server" className="server-stats"/>
        </div>
      </div>
    </div>
    
  );
}

export default App;
