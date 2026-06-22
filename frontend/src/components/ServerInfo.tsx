import React, { useState } from "react";
// @ts-ignore
import StartServerButton from "./StartServerButton.tsx";
// @ts-ignore
import Whitelist from "./Whitelist.tsx";
// @ts-ignore
import Password from "./Password.tsx";
// @ts-ignore
import classes from "../pages/HomePage.module.css"

interface ServerInfoProps {
  className?: string;
  serverName: string;
  buttonName: string;
  requirements?: string;
  serverDescription: string;
  backendURL: string;
  onStateChange?: (newState: string) => void;
}

function ServerInfo({
  className,
  serverName,
  buttonName,
  serverDescription,
  requirements,
  backendURL,
  onStateChange,
}: ServerInfoProps) {
  const [clicked, setClicked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={className} onClick={() => setClicked((prev) => !prev)}>
      <h2 key={clicked ? "reqs" : "title"} className={`${classes["header"]} ${classes["slide-text"]}`}>
        {clicked ? "Reqs" : serverName}
      </h2>

      <div
        key={clicked ? "reqs-desc" : "desc"}
        className={`${classes["paragraph"]} ${classes["slide-text"]}`}
      >
        {clicked ? (requirements ? requirements : "N/A") : serverDescription}
      </div>

      {clicked ? (
        <Whitelist />
      ) : (
        <StartServerButton
          className={`${classes["startButton"]}`}
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
