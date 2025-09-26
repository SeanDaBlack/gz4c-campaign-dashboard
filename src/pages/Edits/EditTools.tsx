import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/Tools.css";
import "../../styles/ALL_PAGES.css";
// import { Button, TextField } from "@mui/material";
// import { FileUpload } from "../../components/FileUpload";
import { validateUrl } from "../../util/handle_url"; // Import URL validation utility


// const post_url = "https://get-statement-data-893947194926.us-central1.run.app/get_tools";
const post_url = "http://127.0.0.1:8080/get_tools";

const ENCODED_PASSWORD = import.meta.env.VITE_ENCODED_PASSWORD;

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
  steps: { [key: string]: { title: string; content: string } };
  questions: { q: string, a: string }[];
}

export default function EditTools() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the statement data from router state
  const toolData = location.state as ToolData;

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [longerDescription, setLongerDescription] = useState("");
  const [online, setOnline] = useState(toolData?.online || false);
  const [sunsetted, setSunsetted] = useState(toolData?.sunsetted || false);
  const [feature, setFeature] = useState(toolData?.feature || false);
  const [emailCounter, setEmailCounter] = useState(toolData?.emailCounter || 0);
  const [steps, setSteps] = useState<{ [key: string]: { title: string; content: string } }>({});
  const [questions, setQuestions] = useState<{ q: string, a: string }[]>([]);
  // const [error, setError] = useState<string | null>(null);
  const [option, setOption] = useState<string>("");
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [newAnswer, setNewAnswer] = useState<string>("");

  const [optionStep, setOptionStep] = useState<string>("");
  // const [step, setStep] = useState<{ title: string; content: string }>({ title: "", content: "" });
  const [newStep, setNewStep] = useState<{ title: string; content: string }>({ title: "", content: "" });





  const [imgSrc, setImgSrc] = useState(""); // Uncomment if you want to edit image source
  // const [date, setDate] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const [date, setDate] = useState(toolData?.date || ""); // Initialize date from toolData or empty string

  const [, setUuid] = useState("");
  const handleFileUpload = (file: File | null) => {
    setUploadedFile(file);
  };
  // Update states when component mounts or when location state changes
  useEffect(() => {
    if (toolData) {
      setTitle(toolData.title || "");
      setUrl(toolData.url || "");
      setDescription(toolData.description || "");
      setLongerDescription(toolData.longerDescription || "");
      setOnline(Boolean(toolData.online));
      setSunsetted(Boolean(toolData.sunsetted));
      setFeature(Boolean(toolData.feature));
      setEmailCounter(toolData.emailCounter || 0);
      setSteps(toolData.steps || {});
      setQuestions(toolData.questions || []);
      setImgSrc(toolData.imgSrc || ""); // Uncomment if you want to edit image source
      setDate(toolData.date || ""); // Set date from toolData
      setUuid(toolData.uuid || "");

    }
  }, [toolData]);

  // Handle case where no data is passed (user navigated directly to URL)
  useEffect(() => {
    if (!toolData) {
      console.log("No tool data found, redirecting to tool list");
      navigate("/tools");
    }
  }, [toolData, navigate]);

  const handleSave = () => {
    console.log("Tool saved:", title);

    // Use FormData instead of JSON for file uploads
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("longerDescription", longerDescription);
    formData.append("online", String(online));
    formData.append("sunsetted", String(sunsetted));
    formData.append("feature", String(feature));
    formData.append("emailCounter", String(emailCounter));
    formData.append("steps", JSON.stringify(steps));
    formData.append("questions", JSON.stringify(questions));
    formData.append("imgSrc", imgSrc);
    formData.append("url", url);
    // formData.append("date", date); // Uncomment if you want to edit date

    if (uploadedFile) {
      formData.append("file", uploadedFile);
    }

    formData.append("date", date);
    formData.append("uuid", toolData?.uuid || crypto.randomUUID());

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
        navigate("/tools");
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
  const handleAddQuestion = () => {
    // Add a new question to the questions array
    setQuestions([
      ...questions,
      {
        q: (document.getElementById("new-question") as HTMLInputElement)?.value || "",
        a: (document.getElementById("new-answer") as HTMLInputElement)?.value || ""
      }
    ]);
    // Clear input fields
    (document.getElementById("new-question") as HTMLInputElement).value = "";
    (document.getElementById("new-answer") as HTMLInputElement).value = "";
    setOption(""); // Reset the select dropdown
  }

  const handleEditQuestion = () => {
    if (option === "new" || option === "") return; // Do nothing if "new" or no option is selected

    questions[Number(option)] = {
      q: (document.getElementById("new-question") as HTMLInputElement)?.value || "",
      a: (document.getElementById("new-answer") as HTMLInputElement)?.value || ""
    };
    setQuestions([...questions]); // Trigger re-render by creating a new array reference

    (document.getElementById("new-question") as HTMLInputElement).value = "";
    (document.getElementById("new-answer") as HTMLInputElement).value = "";
    setOption(""); // Reset the select dropdown
  }
  const handleDelQuestion = () => {
    if (option === "new" || option === "") return; // Do nothing if "new" or no option is selected


    questions.splice(Number(option), 1);
    setQuestions([...questions]); // Trigger re-render by creating a new array reference

    // Clear input fields
    (document.getElementById("new-question") as HTMLInputElement).value = "";
    (document.getElementById("new-answer") as HTMLInputElement).value = "";
    setOption(""); // Reset the select dropdown

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
        <h1>Edit Tool</h1>

        <div
          className="edit-form"

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

          <label htmlFor="edit-date"></label>
          <input
            type="date"
            id="edit-date"
            name="edit-date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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
          <label htmlFor="edit-description"></label>
          <input
            type="text"
            id="edit-description"
            name="edit-description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="edit-longer-description"></label>
          <textarea
            id="edit-longer-description"
            name="edit-longer-description"
            placeholder="Longer Description"
            value={longerDescription}
            onChange={(e) => setLongerDescription(e.target.value)}
            rows={6}
          />

          <>
            <select name="edit-questions" id="edit-questions" onChange={(e) => {
              setOption(e.target.value);
              if (e.target.value === "new") {
                setNewQuestion("");
                setNewAnswer("");
              }
              else if (e.target.value !== "") {
                const selectedQuestion = questions[Number(e.target.value)];
                setNewQuestion(selectedQuestion?.q || "");
                setNewAnswer(selectedQuestion?.a || "");
              }

            }} value={option}>
              <option value="">---Select a Question to Edit---</option>
              <option value="new">+ Add New Question</option>

              {questions ? questions.map((questionObj, index) => (
                <option key={index} value={index}>{`Q: ${questionObj.q} | A: ${questionObj.a}`}</option>
              )) : null}


            </select>
            {option !== "" ? (
              <>
                <input id="new-question" type="text" placeholder="New Question" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} />
                <input id="new-answer" type="text" placeholder="New Answer" value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} />
                <div className="button-group">
                  {option === "new" ? <button onClick={handleAddQuestion}>Add Question</button> : null}
                  {option !== "new" && option !== "" ? (<button onClick={handleEditQuestion}>Edit Question</button>) : null}
                  {option !== "new" && option !== "" ? (<button onClick={handleDelQuestion}>Delete Question</button>) : null}
                </div>
              </>
            ) : null}


          </>


          <>
            <select name="edit-steps" id="edit-steps" onChange={(e) => {
              setOptionStep(e.target.value)
              if (e.target.value === "new") {
                setNewStep({ title: "", content: "" });
              }
              else if (e.target.value !== "") {
                const selectedStep = steps[e.target.value];
                setNewStep({ title: selectedStep?.title || "", content: selectedStep?.content || "" });
              }
            }} value={optionStep}>
              <option value="">---Select a Step to Edit---</option>
              <option value="new">+ Add New Step</option>

              {Object.entries(steps).map(([key,], index) => (
                <option key={index} value={key}>{`Step: ${index + 1}`}</option>

              ))}

            </select>

            {optionStep !== "" ? (
              <>
                <input id="new-step-title" type="text" placeholder="Step Title" value={newStep.title} onChange={(e) => { setNewStep({ ...newStep, title: e.target.value }) }} />
                <textarea id="new-step-content" placeholder="Step Content" value={newStep.content} onChange={(e) => { setNewStep({ ...newStep, content: e.target.value }) }} />
              </>
            ) : null}
            <div className="button-group">

              {optionStep === "new" ? <button onClick={() => {
                if (newStep.title === "" || newStep.content === "") return;
                const newKey = `step${Object.keys(steps).length + 1}`;
                setSteps({ ...steps, [newKey]: newStep });
                setNewStep({ title: "", content: "" });
                setOptionStep(""); // Reset the select dropdown
              }}>Add Step</button> : null}
              {optionStep !== "new" && optionStep !== "" ? (<button onClick={() => {
                if (newStep.title === "" || newStep.content === "") return;
                setSteps({ ...steps, [optionStep]: newStep });
                setNewStep({ title: "", content: "" });
                setOptionStep(""); // Reset the select dropdown
              }}>Edit Step</button>) : null}
              {optionStep !== "new" && optionStep !== "" ? (<button onClick={() => { }}>Delete Step</button>) : null}
            </div>

          </>



          <>
            <div className="checkbox-group">
              <label htmlFor="edit-online">Online?</label>
              {online ? <input
                type="checkbox"
                id="edit-online"
                checked={Boolean(online)}
                onChange={(e) => setOnline(e.target.checked)}
              /> : <input
                type="checkbox"
                id="edit-online"
                onChange={(e) => setOnline(e.target.checked)}
              />}
            </div>
            <div className="checkbox-group">
              <label htmlFor="edit-sunsetted">Sunsetted?</label>
              {online ? <input
                type="checkbox"
                id="edit-sunsetted"
                checked={Boolean(sunsetted)}
                onChange={(e) => setSunsetted(e.target.checked)}
              /> : <input
                type="checkbox"
                id="edit-sunsetted"
                onChange={(e) => setSunsetted(e.target.checked)}
              />}
            </div>
            <div className="checkbox-group">
              <label htmlFor="edit-feature">Featured?</label>
              {feature ? <input
                type="checkbox"
                id="edit-feature"
                checked={Boolean(feature)}
                onChange={(e) => setFeature(e.target.checked)}
              /> : <input
                type="checkbox"
                id="edit-feature"
                onChange={(e) => setFeature(e.target.checked)}
              />}
            </div>
          </>







          <div className="group">
            <label htmlFor="edit-email-counter">Email Count</label>
            <input
              type="number"
              id="edit-email-counter"
              name="edit-email-counter"
              placeholder="Email Counter"
              value={emailCounter}
              onChange={(e) => setEmailCounter(Number(e.target.value))}
            />
          </div>
          <label>Image Preview (click to remove):</label>

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
      </div >
    </>
  );
}
