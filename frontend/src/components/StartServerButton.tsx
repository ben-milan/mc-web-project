import React from "react";

interface StartServerButtonProps {
  className?: string;
  name: string;
  onClick: () => void;
}

function StartServerButton({
  className,
  name,
  onClick,
}: StartServerButtonProps) {
  return (
    <button
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
        console.log("Button Click");
      }}
    >
      {name}
    </button>
  );
}

export default StartServerButton;
