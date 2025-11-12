import React, { useState } from "react";
import StartServerButton from "./StartServerButton.tsx";
import Whitelist from "./Whitelist.tsx";
import Password from "./Password.tsx";

interface ServerInfoProps {
  className?: string;
  serverName: string;
  buttonName: string;
  requirements: string;
  serverDescription: string;
  serverState: string;
  backendURL: string;
  onStateChange: (newState: string) => void;
}

function ServerInfo({
  className,
  serverName,
  buttonName,
  serverDescription,
  requirements,
  backendURL,
  serverState,
  onStateChange,
}: ServerInfoProps) {
  const [clicked, setClicked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={className} onClick={() => setClicked((prev) => !prev)}>
      <h2 key={clicked ? "reqs" : "title"} className="header slide-text">
        {clicked ? "Reqs" : serverName}
      </h2>

      <div
        key={clicked ? "reqs-desc" : "desc"}
        className="paragraph slide-text"
      >
        {clicked ? (requirements ? requirements : "N/A") : serverDescription}
      </div>

      {clicked ? (
        <Whitelist />
      ) : (
        <StartServerButton
          className="startButton"
          name={buttonName}
          onClick={() => setShowPassword((prev) => !prev)}
        />
      )}

      {showPassword && (
        <Password
          backend={backendURL}
          endpoint={serverName.toLowerCase().concat("-check-pw")}
          onStateChange={onStateChange}
        />
      )}
    </div>
  );
}

export default ServerInfo;
