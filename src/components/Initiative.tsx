// import React, { useState, useEffect } from "react";
import "../styles/Form.css"; // Assuming you have a CSS file for styling

interface InitiativeProps {
  title: string;
  url: string;
  archived: boolean;
  problem: string;
  solution: string;
  achievement: string;
  date: string;
  topics: string[]; // Array of topics, can be used for filtering or categorization
  imgSrc: string; // Optional image source, can be used for displaying an image
  uuid: string;
}

// card style component to display a statement formatted like data above
export default function Initiative(InitiativeProps: InitiativeProps) {
  return (
    <div className="form-container">
      <h1>
        <a href={InitiativeProps.url}>{InitiativeProps.title}</a>
      </h1>
      <img
        src={InitiativeProps.imgSrc}
        alt="Publication"
        style={{ width: "300px", height: "300px" }}
      />
      <p className="statement-topics">
        Topics: {InitiativeProps.topics.join(", ")}

      </p>
      <p className="form-item-content">{InitiativeProps.url}</p>
      <p className="form-item-content">
        Archived: {InitiativeProps.archived ? "Yes" : "No"}
      </p>
      <p className="form-item-content">Problem: {InitiativeProps.problem}</p>
      <p className="form-item-content">Solution: {InitiativeProps.solution}</p>
      <p className="form-item-content">
        Achievement: {InitiativeProps.achievement}
      </p>
      <p className="form-item-content">Date: {InitiativeProps.date}</p>
    </div>
  );
}
