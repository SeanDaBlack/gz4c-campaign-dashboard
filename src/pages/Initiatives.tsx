// file to display all initiatives with an edit buutton to change one

import { useState, useEffect } from "react";
import "../styles/Statements.css";
// import { Button } from "@mui/material";
// import { FileUpload } from "./FileUpload";

// import redirect component
import { useNavigate } from "react-router-dom"; // Uncomment if you want to use react-router for navigation
import Initiative from "../components/Initiative";

const url =
  "https://get-statement-data-893947194926.us-central1.run.app/get_initiatives";

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

export default function Initiatives() {
  const [initiatives, setInitiatives] = useState<InitiativeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchInitiatives();
  }, []);
  // usenavigate is used to navigate to another page
  const navigate = useNavigate();

  const fetchInitiatives = async () => {
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
      console.log("Fetched initiatives:", data);

      // Assuming the API returns an array of initiatives
      setInitiatives(data);
    } catch (err) {
      console.error("Error fetching initiatives:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch initiatives"
      );
    } finally {
      setLoading(false);
    }
  };

  const createInitiatives = () => {
    // Navigate to the edit initiatives page with empty fields
    navigate("/edit-initiatives", {
      state: {
        title: "",
        url: "",
        archived: true,
        problem: "",
        solution: "",
        achievement: "",
        date: new Date().toISOString().split("T")[0], // Set current date as default
        uuid: crypto.randomUUID(), // Generate a new UUID
      },
    });
  };

  const deleteInitiative = async (uuid: string) => {
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
      fetchInitiatives();
    }
  };

  if (loading) {
    return (
      <div className="initiatives-container">
        <h1>Initiatives</h1>
        <p>Loading initiatives...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statements-container">
        <h1>Initiatives</h1>
        <p>Error: {error}</p>
        <button onClick={fetchInitiatives} color="primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="statements-container">
      <h1>Initiatives</h1>
      <p className="statement-description">
        View and manage all initiatives below.
      </p>

      {/* Add refresh button */}
      {initiatives.length != 0 ? (
        <div className="button-group">
          <button onClick={fetchInitiatives}>Refresh Initiatives</button>
          <button onClick={createInitiatives}>Create New Initiatives</button>
        </div>
      ) : (
        <button onClick={createInitiatives} style={{ marginBottom: "20px" }}>
          Create New Initiatives
        </button>
      )}

      {/* Display initiatives */}
      {initiatives.length === 0 ? (
        <p>No initiatives found.</p>
      ) : (
        <div className="cardList">
          {initiatives.map((initiativeData, index) => (
            <div key={index} className="cardItem">
              <Initiative
                title={initiativeData.title}
                url={initiativeData.url}
                archived={initiativeData.archived}
                problem={initiativeData.problem}
                solution={initiativeData.solution}
                achievement={initiativeData.achievement}
                date={initiativeData.date}
                uuid={initiativeData.uuid} // Pass the UUID if available
              />
              {/* Add edit button for each statement */}
              <div className="button-group">
                <button
                  id="edit"
                  style={{ margin: "10px 0" }}
                  onClick={() => {
                    // Navigate to edit page or open edit modal
                    console.log("Edit statement:", initiativeData.title);

                    // store the statement data in local storage
                    localStorage.setItem(
                      "currentInitiative",
                      JSON.stringify(initiativeData)
                    );

                    // Redirect to edit page
                    navigate("/edit-initiatives", {
                      state: {
                        title: initiativeData.title,
                        url: initiativeData.url,
                        archived: initiativeData.archived,
                        problem: initiativeData.problem,
                        solution: initiativeData.solution,
                        achievement: initiativeData.achievement,
                        date: initiativeData.date,
                        uuid: initiativeData.uuid, // Pass the UUID if available
                      },
                    });
                  }}
                >
                  Edit Initiative
                </button>
                <button
                  id="delete"
                  style={{ margin: "10px 0" }}
                  onClick={() => {
                    // Handle delete statement logic here
                    console.log("Delete statement:", initiativeData.title);
                    deleteInitiative(initiativeData.uuid);
                    // You can implement the delete functionality here
                  }}
                >
                  Delete Initiative
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
