import React, { useState } from "react";

interface PasswordProps {
  endpoint: string;
  onStateChange: (value: string) => void;
}

function Password({ endpoint, onStateChange }: PasswordProps) {
  const [password, setPassword] = useState("");
  const [bgColor, setBgColor] = useState("rgba(255, 255, 255, 0.00005)");

  const backend = "http://localhost:3001/";

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const res = await fetch(`${backend + endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (data.valid) {
        setBgColor("rgba(0, 255, 0, 0.4)");
        onStateChange("🟡 Server Starting...");
        const res = await fetch(`${backend + "start-server"}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ server: data.server }),
        });

        const startData = await res.json();

        if (startData.state === "started") {
          onStateChange("🟢 Server Online");
        }

        if (startData.state === "running") {
          onStateChange("🟢 Server Online");
          alert("Server has already been started!");
        }
      } else {
        setBgColor("rgba(255, 0, 0, 0.4)");
      }

      setTimeout(() => {
        setBgColor("rgba(255, 255, 255, 0.00005)");
      }, 500);
    }
  };

  return (
    <input
      type="text"
      name="password"
      id="password"
      className="container-pw"
      style={{ backgroundColor: bgColor }}
      placeholder="Enter the Code"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      onKeyDown={handleKeyDown}
      onClick={(e) => e.stopPropagation()}
    />
  );
}

export default Password;
