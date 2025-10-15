import React from "react";
import "./DataCard.css";

const DataCard = ({ title, latestValue, latestTime, icon, color }) => {
  return (
    <div className="data-card" style={{ "--card-color": color }}>
      <h3>{icon} {title}</h3>
      <p>Latest Value: <span>{latestValue}</span></p>
      <p>Last Updated: <span>{latestTime}</span></p>
    </div>
  );
};

export default DataCard;
