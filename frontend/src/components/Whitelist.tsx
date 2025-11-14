import React, { useState } from "react";

function Whitelist() {
  const [value, setValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      console.log(`"ENTER PRESSED! VALUE: ${value}`);
      // here you could also call a prop callback or send value to backend
    }
  };

  return (
    <input
      type="text"
      name="whitelist"
      id="whitelist"
      className="whitelist"
      placeholder="Work in Progress"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onClick={(e) => e.stopPropagation()}
    />
  );
}

export default Whitelist;
