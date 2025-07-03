// file to display all statements with an edit buutton to change one

import React, { useState, useEffect } from "react";
import "../styles/Statements.css"; // Assuming you have a CSS file for styling
import { Button, TextField, ButtonGroup } from "@mui/material";
import { FileUpload } from "./FileUpload"; // Adjust the import path as necessary

// data = {
//     date	"2025-07-03 20:57:25"
//     description	"Hello this is a test"
//     imgSrc	"https://storage.googleapis.com/gz4c-site-data/statement-data/20250703_205725_843e1d0e.png"
//     statement	"This is the initial statement. You can edit this text."
//     title	"Test Statement 1"
//     topics	'["AI"," Technology"," Yellow"]'

// }

interface StatementProps {
  title: string;
  description: string;
  imgSrc: string;
  statement: string;
  topics: string[];
  date: string;
}

// card style component to display a statement formatted like data above
export default function Statement(StatementProps: StatementProps) {
  return (
    <div className="statement-container">
      <h1>{StatementProps.title}</h1>
      <p className="statement-description">{StatementProps.description}</p>
      <img src={StatementProps.imgSrc} alt="Statement" />
      <p className="statement-content">{StatementProps.statement}</p>
      <p className="statement-topics">
        Topics: {StatementProps.topics.join(", ")}
      </p>
      <p className="statement-date">Date: {StatementProps.date}</p>
    </div>
  );
}
