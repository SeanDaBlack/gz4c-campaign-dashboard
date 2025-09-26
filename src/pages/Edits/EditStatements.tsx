import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/Statements.css";
import "../../styles/ALL_PAGES.css";
// import { Button, TextField } from "@mui/material";
// import { FileUpload } from "../../components/FileUpload";
import { validateUrl } from "../../util/handle_url"; // Import URL validation utility

import {
  // checkHighlighted,
  wrapHighlighted,
  prependHighlighted,
  convertMarkdownToHTML,
} from "../../util/statements";

interface StatementData {
  title: string;
  description: string;
  imgSrc: string;
  statement: string;
  topics: string[];
  date: string;
  uuid: string;
}

const ENCODED_PASSWORD = import.meta.env.VITE_ENCODED_PASSWORD;

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
  const [, setUuid] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [date, setDate] = useState(statementData?.date?.substring(0, 10) || ""); // Initialize date from statementData or empty string
  const [showImageUpload, setShowImageUpload] = useState(false);

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
      setDate(statementData.date || "");
      // Fix: Check if topics is an array before calling join
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
    formData.append("imgSrc", imgSrc); // Include imgSrc if you want to edit image source
    formData.append("date", date); // Include date in the form data

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
        Authorization: `Bearer ${atob(ENCODED_PASSWORD)}`,
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

  const handleBtnClick = (e: any) => {
    e.preventDefault();
    switch (e.currentTarget.innerText) {
      case "Image from Upload":
        console.log("Image from Upload selected");
        setShowImageUpload(true);
        setImgSrc(""); // Reset image source when switching to upload
        break;
      case "Image from URL":
        console.log("Image from URL selected");
        setShowImageUpload(false);
        break;
      default:
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    if (validateUrl(newUrl)) {
      setImgSrc(newUrl);
      console.log("Valid URL:", newUrl);
    } else {
      console.error("Invalid URL format");
    }
  };

  return (
    <>
      <div className="main-content">
        <h1>Edit Statement</h1>

        <div className="edit-form">
          <label htmlFor="edit-title"></label>
          <input
            type="text"
            id="edit-title"
            name="edit-title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="edit-date"></label>
          <input
            type="date"
            id="edit-date"
            name="edit-date"
            placeholder="Date"
            value={date.substring(0, 10)}
            onChange={(e) => setDate(e.target.value)}
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
            onChange={(e) => {
              const newTopics = e.target.value
                .split(",")
                .map((topic) => topic.trim());
              setTopics(newTopics);
            }}
          />

          {/* btn group for "b" "i" and more */}
          <div className="btn-group">
            <button
              onClick={(e) => {
                e.preventDefault();
                setStatement(wrapHighlighted("**", statement));
              }}
            >
              B
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setStatement(wrapHighlighted("*", statement));
              }}
            >
              I
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setStatement(prependHighlighted("# ", statement));
              }}
            >
              H1
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setStatement(prependHighlighted("## ", statement));
              }}
            >
              H2
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setStatement(prependHighlighted("### ", statement));
              }}
            >
              H3
            </button>
          </div>

          <label htmlFor="edit-statement"></label>
          <textarea
            id="edit-statement"
            name="edit-statement"
            placeholder="Statement"
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
          />

          <div className="preview-section">
            <h3>Preview</h3>
            <div
              id="preview"
              className="markdown-preview"
              dangerouslySetInnerHTML={{
                __html: convertMarkdownToHTML(statement),
              }}
            />
          </div>

          {imgSrc ? (
            <button onClick={handleClick} style={{ background: "none" }}>
              <img src={imgSrc} height={"300px"} />
            </button>
          ) : null}

          <div className="btn-group">
            <button onClick={(e) => handleBtnClick(e)}>Image from Url</button>
            <button onClick={(e) => handleBtnClick(e)}>
              Image from Upload
            </button>
          </div>

          {showImageUpload ? (
            <div className="upload">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
            </div>
          ) : (
            <div className="upload">
              <input
                type="text"
                placeholder="image url"
                onChange={handleChange}
                value={imgSrc}
              />
            </div>
          )}

          <button type="button" onClick={handleSave}>
            Confirm
          </button>
        </div>
      </div>
    </>
  );
}
