import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/Statements.css";
// import { Button, TextField } from "@mui/material";
// import { FileUpload } from "../../components/FileUpload";

// import {
//   // checkHighlighted,
//   wrapHighlighted,
//   prependHighlighted,
// } from "../util/statements";

interface InitiativeData {
  title: string;
  url: string;
  archived: boolean;
  problem: string;
  solution: string;
  achievement: string;
  date: string;
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
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [achievement, setAchievement] = useState(""); // Uncomment if you want to edit achievement
  // const [date, setDate] = useState("");

  const [, setUuid] = useState("");

  // Update states when component mounts or when location state changes
  useEffect(() => {
    if (initiativeData) {
      setTitle(initiativeData.title || "Initial Title");
      setUrl(initiativeData.url || "");
      setArchived(initiativeData.archived);
      setProblem(initiativeData.problem);
      setSolution(initiativeData.solution);
      setAchievement(initiativeData.achievement);

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
    formData.append("problem", problem);
    formData.append("solution", solution);
    formData.append("achievement", achievement);

    formData.append("date", initiativeData.date);
    formData.append("uuid", initiativeData?.uuid || crypto.randomUUID());

    const post_url =
      "https://get-statement-data-893947194926.us-central1.run.app/get_initiatives";

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
        navigate("/initiatives");
      });
  };

  return (
    <>
      <div className="main-content">
        <h1>Edit Initiative</h1>

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

          <button type="button" onClick={handleSave}>
            Confirm
          </button>
        </div>
      </div>
    </>
  );
}
