import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "../styles/Press.css";
import Publication from "../components/Publication";

interface PublicationData {
  title: string;
  publication: string;
  url: string;
  date: string;
  uuid: string;
}

const post_url =
  "https://get-statement-data-893947194926.us-central1.run.app/get_press";

export default function Press() {
  const [pressList, setPressList] = useState<PublicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPress();
  }, []);

  const navigate = useNavigate();
  const fetchPress = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(post_url, {
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
      console.log("Fetched press entries:", data);

      // Assuming the API returns an array of press entries
      setPressList(data);
    } catch (err) {
      console.error("Error fetching press entries:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch press entries"
      );
    } finally {
      setLoading(false);
    }
  };
  const createPress = () => {
    navigate("/edit-press", {
      state: {
        title: "",
        publication: "",
        url: "",
        date: new Date().toISOString().split("T")[0], // Default to today's date
      } as PublicationData,
    });
  };

  const deletePress = async (uuid: string) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();

      formData.append("uuid", uuid);

      const response = await fetch(post_url, {
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
      fetchPress();
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="statements-container">
        <h1>Press</h1>
        <p>Loading press...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statements-container">
        <h1>Press</h1>
        <p>Error: {error}</p>
        <button onClick={fetchPress} color="primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="main-container">
      <h1>Press Page</h1>
      <p>This is the Press page content.</p>

      {pressList.length != 0 ? (
        <div className="button-group">
          <button onClick={fetchPress}>Refresh Press Entries</button>
          <button onClick={createPress}>Create New Press Entry</button>
        </div>
      ) : (
        <button onClick={createPress}>Create New Press Entry</button>
      )}

      {/* Display PressList */}

      {pressList.length === 0 ? (
        <p>No Press Entries Found</p>
      ) : (
        <div className="cardList">
          {pressList.map((publicationData, index) => (
            <div className="cardItem">
              <Publication
                key={"publication" + String(index)}
                title={publicationData.title}
                publication={publicationData.publication}
                date={publicationData.date}
                url={publicationData.url}
                uuid={publicationData.uuid}
              />
              <div className="button-group">
                <button
                  // variant="contained"
                  id="edit"
                  style={{ margin: "10px 0" }}
                  onClick={() => {
                    // Navigate to edit page or open edit modal
                    console.log("Edit Press Entry:", publicationData.title);

                    // store the statement data in local storage
                    localStorage.setItem(
                      "currentStatement",
                      JSON.stringify(publicationData)
                    );

                    // Redirect to edit page
                    navigate("/edit-press", {
                      state: {
                        title: publicationData.title,
                        date: publicationData.date,
                        uuid: publicationData.uuid, // Pass the UUID if available
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
                    console.log("Delete Press Entry:", publicationData.title);
                    deletePress(publicationData.uuid);
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
