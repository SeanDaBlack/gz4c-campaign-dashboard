import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/Statements.css";
// import { Button, TextField } from "@mui/material";
import { FileUpload } from "../../components/FileUpload";

// import {
//   // checkHighlighted,
//   wrapHighlighted,
//   prependHighlighted,
// } from "../util/statements";

interface PressData {
  title: string;
  publication: string;
  url: string;
  date: string;
  uuid: string;
}

export default function EditStatements() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the statement data from router state
  const pressData = location.state as PressData;

  const [title, setTitle] = useState("");
  const [publication, setPublication] = useState("");
  const [url, setUrl] = useState("");
  const [uuid, setUuid] = useState("");

  // Update states when component mounts or when location state changes
  useEffect(() => {
    if (pressData) {
      setPublication(pressData.publication || "Publication");
      setTitle(pressData.title || "Initial Title");
      setUrl(pressData.url || "");
      setUuid(pressData.uuid || crypto.randomUUID());
    }
  }, [pressData]);

  // Handle case where no data is passed (user navigated directly to URL)
  useEffect(() => {
    if (!pressData) {
      console.log("No statement data found, redirecting to statements list");
      navigate("/press");
    }
  }, [pressData, navigate]);

  const handleSave = () => {
    console.log("Publication saved:", publication);

    // Use FormData instead of JSON for file uploads
    const formData = new FormData();
    formData.append("title", title);
    formData.append("publication", publication);
    formData.append("url", url);
    formData.append("date", pressData.date);
    formData.append("uuid", pressData?.uuid || crypto.randomUUID());

    const post_url =
      "https://get-statement-data-893947194926.us-central1.run.app/get_press";

    fetch(post_url, {
      method: "POST",
      headers: {
        // Remove "Content-Type" header - let browser set it automatically for FormData
        Authorization: `Bearer ${"password123"}`,
      },
      body: formData, // Use FormData instead of JSON.stringify
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        // Optionally, reset the form or show a success message
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        //navigate back to press page after saving
        navigate("/press");
      });
  };

  return (
    <>
      <div className="main-content">
        <h1>Edit Press Publication</h1>

        <div
          className="edit-form"
          style={{ width: "100%", display: "flex", flexDirection: "column" }}
        >
          <label htmlFor="edit-title"></label>
          <input
            type="text"
            id="edit-title"
            name="edit-title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label htmlFor="edit-publication"></label>
          <input
            type="text"
            id="edit-publication"
            name="edit-publication"
            placeholder="Publication"
            value={publication}
            onChange={(e) => setPublication(e.target.value)}
          />
          <label htmlFor="edit-url"></label>
          <input
            type="text"
            id="edit-url"
            name="edit-url"
            placeholder="Url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button type="button" onClick={handleSave}>
            Confirm
          </button>
        </div>
      </div>
    </>
  );
}
