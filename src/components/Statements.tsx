// file to display all statements with an edit buutton to change one

import React, { useState, useEffect } from "react";
import "../styles/Statements.css";
import { Button, TextField, ButtonGroup } from "@mui/material";
import { FileUpload } from "./FileUpload";

// import redirect component
import { useNavigate } from "react-router-dom"; // Uncomment if you want to use react-router for navigation
import Statement from "./Statement";

const url = "https://get-statement-data-893947194926.us-central1.run.app/";

interface StatementData {
  date: string;
  description: string;
  imgSrc: string;
  statement: string;
  title: string;
  topics: string; // JSON string that needs to be parsed
}

export default function Statements() {
  const [statements, setStatements] = useState<StatementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchStatements();
  }, []);
  // usenavigate is used to navigate to another page
  const navigate = useNavigate();

  const fetchStatements = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authorization if needed
          // Authorization: `Bearer ${"password123"}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched statements:", data);

      // Assuming the API returns an array of statements
      setStatements(data);
    } catch (err) {
      console.error("Error fetching statements:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch statements"
      );
    } finally {
      setLoading(false);
    }
  };

  const parseTopics = (topicsString: string): string[] => {
    try {
      return JSON.parse(topicsString);
    } catch (error) {
      console.error("Error parsing topics:", error);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="statements-container">
        <h1>Statements</h1>
        <p>Loading statements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statements-container">
        <h1>Statements</h1>
        <p>Error: {error}</p>
        <Button onClick={fetchStatements} variant="contained" color="primary">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="statements-container">
      <h1>Statements</h1>
      <p className="statement-description">
        View and manage all statements below.
      </p>

      {/* Add refresh button */}
      <Button
        onClick={fetchStatements}
        variant="outlined"
        style={{ marginBottom: "20px" }}
      >
        Refresh Statements
      </Button>

      {/* Display statements */}
      {statements.length === 0 ? (
        <p>No statements found.</p>
      ) : (
        <div className="statements-list">
          {statements.map((statementData, index) => (
            <div key={index} className="statement-item">
              <Statement
                title={statementData.title}
                description={statementData.description}
                imgSrc={statementData.imgSrc}
                statement={statementData.statement}
                topics={parseTopics(statementData.topics)}
                date={statementData.date}
              />
              {/* Add edit button for each statement */}
              <Button
                variant="contained"
                color="secondary"
                style={{ margin: "10px 0" }}
                onClick={() => {
                  // Navigate to edit page or open edit modal
                  console.log("Edit statement:", statementData.title);

                  // store the statement data in local storage
                  localStorage.setItem(
                    "currentStatement",
                    JSON.stringify(statementData)
                  );

                  // Redirect to edit page
                  navigate("/edit-statements", {
                    state: {
                      title: statementData.title,
                      description: statementData.description,
                      imgSrc: statementData.imgSrc,
                      statement: statementData.statement,
                      topics: parseTopics(statementData.topics),
                      date: statementData.date,
                    },
                  });
                }}
              >
                Edit Statement
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
