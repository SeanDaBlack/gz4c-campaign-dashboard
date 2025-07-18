import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Statements.css";
import { Button, TextField } from "@mui/material";
import { FileUpload } from "../components/FileUpload";

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

    const url = "https://get-statement-data-893947194926.us-central1.run.app/";

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
      });
  };

  const handleClick = () => {
    setUploadedFile(null); // Reset file upload state
  };

  // const replaceSubText = (
  //   original: string,
  //   substring: string,
  //   replacement: string
  // ) => {
  //   return original.replace(substring, replacement);
  // };

  // const handleClick = (tag: string) => {
  //   const textBox = document.querySelector("textarea");
  //   if (!textBox) return;
  //   const originalText = textBox.value;

  //   const selection = window.getSelection()?.toString() || "";

  //   switch (tag) {
  //     case "B":
  //       textBox.value = replaceSubText(
  //         originalText,
  //         selection,
  //         wrapHighlighted("**", statement)
  //       );
  //       break;
  //     case "I":
  //       textBox.value = replaceSubText(
  //         originalText,
  //         selection,
  //         wrapHighlighted("*", statement)
  //       );
  //       break;
  //     case "H1":
  //       console.log("Clicked tag:", tag);

  //       prependHighlighted("# ", statement);
  //       break;
  //     default:
  //       break;
  //   }

  //   // if (checkHighlighted()) {

  //   // }
  // };

  return (
    <div className="statements-content">
      <h1>Edit Statement</h1>

      <TextField
        margin="dense"
        variant="filled"
        label="Title"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        margin="dense"
        variant="filled"
        label="Description"
        fullWidth
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <TextField
        margin="dense"
        variant="filled"
        label="Topics (comma separated)"
        fullWidth
        value={topics.join(", ")}
        onChange={(e) => setTopics(e.target.value.split(","))}
      />

      {/* <br /> */}

      {/* <div className="edit-buttons">
        <Button
          onMouseDown={(e) => {
            e.preventDefault();
            handleClick("H1");
          }}
        >
          H1
        </Button>
        <Button
          onMouseDown={(e) => {
            e.preventDefault();
            handleClick("B");
          }}
        >
          B
        </Button>
        <Button
          onMouseDown={(e) => {
            e.preventDefault();
            handleClick("I");
          }}
        >
          I
        </Button>
        <Button
          onMouseDown={(e) => {
            e.preventDefault();
            handleClick("U");
          }}
        >
          U
        </Button>
      </div> */}

      <TextField
        label="Statement"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        value={statement}
        onChange={(e) => setStatement(e.target.value)}
      />
      {uploadedFile ? (
        <FileUpload onFileUpload={handleFileUpload} />
      ) : (
        <>
          <button onClick={handleClick}>
            <img src={statementData?.imgSrc || ""} alt="Image preview" />
          </button>
          <FileUpload onFileUpload={handleFileUpload} />
        </>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        style={{ marginTop: "10px" }}
      >
        Save Changes
      </Button>
    </div>
  );
}
