import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// import "../styles/Tool.css";
import Tool from "../components/Tool";

interface ToolData {
  uuid: string;
  title: string;
  description: string;
  date: string;
  longerDescription: string;
  emailCounter: number;
  online: boolean;
  sunsetted: boolean;
  url: string;
  imgSrc: string;
  feature: boolean;
  // steps: { [key: string]: { title: string; content: string } };
  stepsApple: string;
  stepsAndroid: string;
  questions: { q: string, a: string }[];
}

const post_url = "https://get-statement-data-893947194926.us-central1.run.app/get_tools";
// const post_url = "http://localhost:5001/get_tools";

const ENCODED_PASSWORD = import.meta.env.VITE_ENCODED_PASSWORD;

export default function Tools() {
  const [toolList, setToolList] = useState<ToolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTools();
  }, []);

  const navigate = useNavigate();
  const fetchTools = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(post_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authorization if needed
          Authorization: `Bearer ${atob(ENCODED_PASSWORD)}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched Tool entries:", data);

      // Assuming the API returns an array of tool entries
      setToolList(data);
    } catch (err) {
      console.error("Error fetching Tool entries:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch Tool entries"
      );
    } finally {
      setLoading(false);
    }
  };
  const createTools = () => {
    navigate("/edit-tools", {
      state: {
        uuid: "",
        title: "",
        description: "",
        date: "",
        longerDescription: "",
        emailCounter: 0,
        online: false,
        sunsetted: false,
        url: "",
        imgSrc: "",
        feature: false,
        // steps: {},
        stepsApple: "",
        stepsAndroid: "",
        questions: [],
      } as ToolData,
    });
  };

  const deleteTools = async (uuid: string) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();

      formData.append("uuid", uuid);

      const response = await fetch(post_url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${atob(ENCODED_PASSWORD)}`,
        },
        body: formData, // Use FormData instead of JSON.stringify
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching Tool entries:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch Tool entries"
      );
    } finally {
      fetchTools();
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="statements-container">
        <h1>Tools</h1>
        <p>Loading tools...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statements-container">
        <h1>Tools</h1>
        <p>Error: {error}</p>
        <button onClick={fetchTools} color="primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="statements-container">
      <h1>Tools Page</h1>
      <p>This is the Tools page content.</p>

      {toolList.length != 0 ? (
        <div className="button-group">
          <button onClick={fetchTools}>Refresh Tool Entries</button>
          <button onClick={createTools}>Create New Tool Entry</button>
        </div>
      ) : (
        <button onClick={createTools}>Create New Tool Entry</button>
      )}

      {/* Display toolList */}

      {toolList.length === 0 ? (
        <p>No Tool Entries Found</p>
      ) : (
        <div className="cardList">
          {toolList.map((toolData, index) => (
            <div className="cardItem">
              <Tool {...toolData} key={index} />
              <div className="button-group">
                <button
                  id="edit"
                  style={{ margin: "10px 0" }}
                  onClick={() => {
                    // Navigate to edit page or open edit modal
                    console.log("Edit Tool Entry:", toolData.title);

                    // store the statement data in local storage
                    localStorage.setItem(
                      "ToolData",
                      JSON.stringify(toolData)
                    );

                    console.log("Stored ToolData in localStorage:", toolData);

                    // Redirect to edit page
                    navigate("/edit-tools", {
                      state: toolData,
                    });
                  }}
                >
                  Edit Tool Entry
                </button>
                <button
                  id="delete"
                  style={{ margin: "10px 0" }}
                  onClick={() => {
                    // Handle delete statement logic here
                    console.log("Delete Tool Entry:", toolData.title);
                    deleteTools(toolData.uuid);
                    // You can implement the delete functionality here
                  }}
                >
                  Delete Tool Entry
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
