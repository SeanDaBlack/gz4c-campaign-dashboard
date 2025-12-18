// import React, { useState, useEffect } from "react";
import "../styles/Form.css"; // Assuming you have a CSS file for styling

interface InitiativeProps {
  title: string;
  url: string;
  archived: boolean;
  summary: string;
  problem: string;
  solution: string;
  achievement: string;
  date: string;
  topics: string[] | string; // Allow both string and array
  imgSrc: string;
  uuid: string;
}

// card style component to display a statement formatted like data above
export default function Initiative(InitiativeProps: InitiativeProps) {
  // Parse topics if it's a string
  const parseTopics = (topics: string[] | string): string[] => {
    if (Array.isArray(topics)) {
      return topics;
    }
    if (typeof topics === "string") {
      try {
        // Try to parse as JSON first
        const parsed = JSON.parse(topics);
        return Array.isArray(parsed) ? parsed : [topics];
      } catch {
        // If JSON parsing fails, split by comma
        return topics
          .split(",")
          .map((topic) => topic.trim())
          .filter((topic) => topic.length > 0);
      }
    }
    return [];
  };

  const topicsArray = parseTopics(InitiativeProps.topics);

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
        Topics: {topicsArray.length > 0 ? topicsArray.join(", ") : "None"}
      </p>
      <p className="form-item-content">{InitiativeProps.url}</p>
      <p className="form-item-content">
        Archived: {InitiativeProps.archived ? "Yes" : "No"}
      </p>
      <p className="form-item-content">Summary: {InitiativeProps.summary}</p>
      <p className="form-item-content">Problem: {InitiativeProps.problem}</p>
      <p className="form-item-content">Solution: {InitiativeProps.solution}</p>
      <p className="form-item-content">
        Achievement: {InitiativeProps.achievement}
      </p>
      <p className="form-item-content">Date: {InitiativeProps.date}</p>
    </div>
  );
}
