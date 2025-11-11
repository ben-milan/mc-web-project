import React, { useState } from "react";

function Password({ endpoint }: { endpoint: string }) {
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
        alert("correct");
        const res = await fetch(`${backend + "start-server"}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ server: data.server }),
        });

        const startData = await res.json();
        alert(startData.serverName);
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
