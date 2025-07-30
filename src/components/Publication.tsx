// import React, { useState, useEffect } from "react";
import "../styles/Form.css"; // Assuming you have a CSS file for styling

interface PressProps {
  title: string;
  publication: string;
  date: string;
  url: string;
  uuid: string;
}

export default function Publication(PressProps: PressProps) {
  return (
    <div className="form-container">
      <h1>
        <a href={PressProps.url}>{PressProps.title}</a>
      </h1>
      <p className="form-publication">{PressProps.publication}</p>
      <p className="form-url">{PressProps.url}</p>
      <p className="form-date">Date: {PressProps.date}</p>
    </div>
  );
}
