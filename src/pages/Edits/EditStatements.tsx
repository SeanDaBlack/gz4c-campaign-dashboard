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

interface StatementData {
  title: string;
  description: string;
  imgSrc: string;
  statement: string;
  topics: string[];
  date: string;
  uuid: string;
}

export default function EditStatements() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the statement data from router state
  const statementData = location.state as StatementData;

  const [statement, setStatement] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uuid, setUuid] = useState("");
  const [imgSrc, setImgSrc] = useState("");

  // Update states when component mounts or when location state changes
  useEffect(() => {
    if (statementData) {
      setStatement(
        statementData.statement ||
          "This is the initial statement. You can edit this text."
      );
      setTitle(statementData.title || "Initial Title");
      setDesc(statementData.description || "Initial Description");
      setTopics(statementData.topics || []);
      setUuid(statementData.uuid || crypto.randomUUID());
      setImgSrc(statementData.imgSrc || "");
    }
  }, [statementData]);

  // Handle case where no data is passed (user navigated directly to URL)
  useEffect(() => {
    if (!statementData) {
      console.log("No statement data found, redirecting to statements list");
      navigate("/statements");
    }
  }, [statementData, navigate]);

  const handleFileUpload = (file: File | null) => {
    setUploadedFile(file);
  };

  const handleSave = () => {
    console.log("Statement saved:", statement);

    // Use FormData instead of JSON for file uploads
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("topics", JSON.stringify(topics)); // Convert array to string
    formData.append("statement", statement);
    formData.append("uuid", statementData?.uuid || crypto.randomUUID());

    // Add the file if it exists
    if (uploadedFile) {
      formData.append("file", uploadedFile);
    }

    const url =
      "https://get-statement-data-893947194926.us-central1.run.app/get_statements";

    fetch(url, {
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
        //navigate back to statements page after saving
        navigate("/statements");
      });
  };

  const handleClick = () => {
    console.log("Image removed");
    setUploadedFile(null); // Reset file upload state
    setImgSrc(""); // Reset image source
  };
  return (
    <>
      <div className="main-content">
        <h1>Edit Statement</h1>

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

          <label htmlFor="edit-description"></label>
          <input
            type="text"
            id="edit-description"
            name="edit-description"
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <label htmlFor="edit-topics"></label>
          <input
            type="text"
            id="edit-topics"
            name="edit-topics"
            placeholder="Topics (comma separated)"
            value={topics.join(", ")}
            onChange={(e) =>
              setTopics(e.target.value.split(",").map((t) => t.trim()))
            }
          />
          <label htmlFor="edit-statement"></label>
          <textarea
            id="edit-statement"
            name="edit-statement"
            placeholder="Statement"
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
          />

          {imgSrc ? (
            <button onClick={handleClick} style={{ background: "none" }}>
              <img src={statementData.imgSrc} height={"300px"} />
            </button>
          ) : (
            <FileUpload
              onFileUpload={handleFileUpload}
              uploadedFile={uploadedFile}
              handleClick={handleClick}
            />
          )}

          <button type="button" onClick={handleSave}>
            Confirm
          </button>
        </div>
      </div>
    </>
  );
}
