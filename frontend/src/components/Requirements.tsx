import React from "react";

interface RequirementItem {
  title: string;
  display: string;
  link: string;
}

interface RequirementsProps {
  items: RequirementItem[];
}

function Requirements({ items }: RequirementsProps) {
  return (
    <div className="requirements-list">
      {items.map((item, index) => (
        <p key={index}>
          {item.title}
          <a
            className="requirements"
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.display}
          </a>
        </p>
      ))}
    </div>
  );
}

export default Requirements;
