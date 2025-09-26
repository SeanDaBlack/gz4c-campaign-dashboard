import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/Statements.css";
import "../../styles/ALL_PAGES.css";
// import { Button, TextField } from "@mui/material";
// import { FileUpload } from "../../components/FileUpload";
import { validateUrl } from "../../util/handle_url"; // Import URL validation utility

// import {
//   // checkHighlighted,
//   wrapHighlighted,
//   prependHighlighted,
// } from "../util/statements";

const ENCODED_PASSWORD = import.meta.env.VITE_ENCODED_PASSWORD;

interface InitiativeData {
  title: string;
  url: string;
  archived: boolean;
  summary: string;
  problem: string;
  solution: string;
  achievement: string;
  date: string;
  imgSrc: string; // Uncomment if you want to edit image source
  topics: string[]; // Array of topics, can be used for filtering or categorization
  uuid: string;
}

export default function EditInitatives() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the statement data from router state
  const initiativeData = location.state as InitiativeData;

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [archived, setArchived] = useState(true);
  const [summary, setSummary] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [achievement, setAchievement] = useState(""); // Uncomment if you want to edit achievement
  const [imgSrc, setImgSrc] = useState(""); // Uncomment if you want to edit image source
  // const [date, setDate] = useState("");
  const [topics, setTopics] = useState<string[]>(initiativeData?.topics || []); // Initialize topics from initiativeData or empty array
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const [date, setDate] = useState(initiativeData?.date || ""); // Initialize date from initiativeData or empty string

  const [, setUuid] = useState("");
  const handleFileUpload = (file: File | null) => {
    setUploadedFile(file);
  };
  // Update states when component mounts or when location state changes
  useEffect(() => {
    if (initiativeData) {
      setTitle(initiativeData.title || "Initial Title");
      setUrl(initiativeData.url || "");
      setArchived(initiativeData.archived);
      setSummary(initiativeData.summary);
      setProblem(initiativeData.problem);
      setSolution(initiativeData.solution);
      setAchievement(initiativeData.achievement);
      setImgSrc(initiativeData.imgSrc || ""); // Set initial image source if available
      setDate(initiativeData.date || ""); // Set initial date if available
      setTopics(initiativeData.topics || []); // Initialize topics from initiativeData or empty array

      setUuid(initiativeData.uuid || crypto.randomUUID());
    }
  }, [initiativeData]);

  // Handle case where no data is passed (user navigated directly to URL)
  useEffect(() => {
    if (!initiativeData) {
      console.log("No initiative data found, redirecting to initiative list");
      navigate("/initiatives");
    }
  }, [initiativeData, navigate]);

  const handleSave = () => {
    console.log("Initiative saved:", title);

    // Use FormData instead of JSON for file uploads
    const formData = new FormData();
    formData.append("title", title);
    formData.append("url", url);
    formData.append("archived", String(archived));
    formData.append("summary", summary);
    formData.append("problem", problem);
    formData.append("solution", solution);
    formData.append("achievement", achievement);
    formData.append("imgSrc", imgSrc); // Include imgSrc if you want to edit image source

    formData.append("topics", JSON.stringify(topics)); // Convert array to string

    if (uploadedFile) {
      formData.append("file", uploadedFile);
    }

    formData.append("date", date);
    formData.append("uuid", initiativeData?.uuid || crypto.randomUUID());

    const post_url =
      "https://get-statement-data-893947194926.us-central1.run.app/get_initiatives";

    fetch(post_url, {
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
        //navigate back to press page after saving
        navigate("/initiatives");
      });
  };

  const handleClick = () => {
    console.log("Image removed");
    setUploadedFile(null); // Reset file upload state
    setImgSrc(""); // Reset image source
    setUrl(""); // Reset URL input
  };

  const handleBtnClick = (e: any) => {
    // e.preventDefault();
    console.log(e.currentTarget.innerText);

    switch (e.currentTarget.innerText) {
      case "Image from Upload":
        // console.log("Image from Upload selected");
        setShowImageUpload(true);
        setImgSrc(""); // Reset image source when switching to upload
        break;
      case "Image from Url":
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
        <h1>Edit Initiative</h1>

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
            value={date}
            onChange={(e) => setDate(e.target.value)}
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

          <label htmlFor="edit-url"></label>
          <input
            type="text"
            id="edit-url"
            name="edit-url"
            placeholder="Url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <label htmlFor="edit-archived">Archived</label>
          <input
            type="checkbox"
            id="edit-archived"
            name="edit-archived"
            checked={
              Boolean(archived) // Ensure archived is a boolean
            }
            onChange={(e) => setArchived(e.target.checked)}
          />
          <label htmlFor="edit-summary"></label>
          <input
            type="text"
            id="edit-summary"
            name="edit-summary"
            placeholder="Summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <label htmlFor="edit-problem"></label>
          <input
            type="text"
            id="edit-problem"
            name="edit-problem"
            placeholder="Problem"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />
          <label htmlFor="edit-solution"></label>
          <input
            type="text"
            id="edit-solution"
            name="edit-solution"
            placeholder="Solution"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
          />
          <label htmlFor="edit-achievement"></label>
          <input
            type="text"
            id="edit-achievement"
            name="edit-achievement"
            placeholder="Achievement"
            value={achievement}
            onChange={(e) => setAchievement(e.target.value)}
          />

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
