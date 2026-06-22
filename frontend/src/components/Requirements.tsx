import React from "react";
// @ts-ignore
import classes from "../pages/HomePage.module.css"
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
    <div className={`${classes["requirements-list"]}`}>
      {items.map((item, index) => (
        <p key={index} className={`${classes["req-box"]}`}>
          {item.title}
          <a
            className={`${classes.requirements}`}
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
