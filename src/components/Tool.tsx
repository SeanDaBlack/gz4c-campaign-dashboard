// import React, { useState, useEffect } from "react";
import "../styles/Form.css"; // Assuming you have a CSS file for styling

interface ToolProps {
  title: string;
  description: string;
  date: string;
  longerDescription: string;
  emailCounter: number;
  online: boolean;
  sunsetted: boolean;
  url: string;
  imgSrc: string;
  feature: boolean;
  steps: { [key: string]: { title: string; content: string } };
  questions: { q: string, a: string }[];


}

export default function Tool(ToolProps: ToolProps) {
  return (
    <div className="form-container">
      <h1>
        <a href={ToolProps.url}>{ToolProps.title}</a>
      </h1>
      <div className="form-content" style={{ flexDirection: "row", alignItems: "center", marginBottom: "40px" }}>

        <img
          src={ToolProps.imgSrc}
          alt="Tool"
          style={{ width: "300px", height: "300px" }}
        />
        <div style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
          <p className="form-item-content"><a href={ToolProps.url}>{ToolProps.url}</a></p>
          <p className="form-item-content">Date: {ToolProps.date}</p>

          <p className="form-item-content">{ToolProps.description}</p>
          <p className="form-item-content">{ToolProps.longerDescription}</p>
          <p className="form-item-content">Featured: {ToolProps.feature}</p>
          <p className="form-item-content">Online: {ToolProps.online}</p>
          <p className="form-item-content">Sunsetted: {ToolProps.sunsetted}</p>
          <p className="form-item-content">Email Counter: {ToolProps.emailCounter}</p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: "20px" }}>
            {Object.entries(ToolProps.steps).map(([key, step]) => (
              <div key={key}>
                {key}:
                <h4>{step.title}</h4>
                <p>{step.content}</p>
              </div>
            ))}
          </div>
          <div>
            {ToolProps.questions ? ToolProps.questions.map((questionObj, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                Question {index + 1}: <br />
                <strong>Q: {questionObj.q}</strong>
                <p>A: {questionObj.a}</p>
              </div>
            )) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
