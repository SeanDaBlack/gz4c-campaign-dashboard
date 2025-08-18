// file to display all statements with an edit buutton to change one

import { useState, useEffect } from "react";
import "../styles/Statements.css";
// import { Button } from "@mui/material";
// import { FileUpload } from "./FileUpload";

// import redirect component
import { useNavigate } from "react-router-dom"; // Uncomment if you want to use react-router for navigation
import Statement from "../components/Statement";

const url =
  "https://get-statement-data-893947194926.us-central1.run.app/get_statements";

interface StatementData {
  date: string;
  description: string;
  imgSrc: string;
  statement: string;
  title: string;
  topics: string[]; // JSON string that needs to be parsed
  uuid: string; // Unique identifier for the statement
}

export default function Statements() {
  const [statements, setStatements] = useState<StatementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [isEditing, setIsEditing] = useState(false);

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
          Authorization: `Bearer ${"password123"}`,
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

  const createStatements = () => {
    // Navigate to the edit statements page with empty fields
    navigate("/edit-statements", {
      state: {
        title: "",
        description: "",
        imgSrc: "",
        statement: "",
        topics: [],
        date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
      },
    });
  };

  const deleteStatement = async (uuid: string) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();

      formData.append("uuid", uuid);

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          // Remove "Content-Type" header - let browser set it automatically for FormData
          Authorization: `Bearer ${"password123"}`,
        },
        body: formData, // Use FormData instead of JSON.stringify
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching press entries:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch press entries"
      );
    } finally {
      setLoading(false);
      fetchStatements();
    }
  };

  // const parseTopics = (topicsString: string): string[] => {
  //   try {
  //     return JSON.parse(topicsString);
  //   } catch (error) {
  //     console.error("Error parsing topics:", error);
  //     return [];
  //   }
  // };

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
        <button onClick={fetchStatements} color="primary">
          Retry
        </button>
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
      {statements.length != 0 ? (
        <div className="button-group">
          <button onClick={fetchStatements}>Refresh Statements</button>
          <button onClick={createStatements}>Create New Statements</button>
        </div>
      ) : (
        <button onClick={createStatements} style={{ marginBottom: "20px" }}>
          Create New Statements
        </button>
      )}

      {/* Display statements */}
      {statements.length === 0 ? (
        <p>No statements found.</p>
      ) : (
        <div className="cardList">
          {statements.map((statementData, index) => (
            <div key={index} className="cardItem">
              <Statement
                title={statementData.title}
                description={statementData.description}
                imgSrc={statementData.imgSrc}
                statement={statementData.statement}
                // topics={parseTopics(statementData.topics)}
                topics={statementData.topics}
                date={statementData.date}
                uuid={statementData.uuid} // Pass the UUID if available
              />
              {/* Add edit button for each statement */}
              <div className="button-group">
                <button
                  id="edit"
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
                        // topics: parseTopics(statementData.topics),
                        topics: statementData.topics,
                        date: statementData.date,
                        uuid: statementData.uuid, // Pass the UUID if available
                      },
                    });
                  }}
                >
                  Edit Statement
                </button>
                <button
                  id="delete"
                  style={{ margin: "10px 0" }}
                  onClick={() => {
                    // Handle delete statement logic here
                    console.log("Delete statement:", statementData.title);
                    deleteStatement(statementData.uuid);
                    // You can implement the delete functionality here
                  }}
                >
                  Delete Statement
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
