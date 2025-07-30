import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EditStatements from "./pages/Edits/EditStatements";
import Statements from "./pages/Statements";
import Press from "./pages/Press";
import EditPress from "./pages/Edits/EditPress";
import Initiatives from "./pages/Initiatives";
import EditInitatives from "./pages/Edits/EditInitiatives";
// import NotFound from "./pages/NotFound";

// import

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Set to true for initial testing

  // const [selectedStatement, setSelectedStatement] = useState({
  //   title: "",
  //   description: "",
  //   imgSrc: "",
  //   statement: "",
  //   topics: [],
  //   date: "",
  // });

  // if even not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Login setIsAuthenticated={setIsAuthenticated} />;
  }

  // const onLoad = () => {
  //   const storedStatement = localStorage.getItem("currentStatement");
  //   if (storedStatement) {
  //     setSelectedStatement(JSON.parse(storedStatement));
  //   }
  // };

  // onLoad();

  return (
    <>
      <div>
        <nav>
          {isAuthenticated ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/statements">Statements</Link>
              <Link to="/press">Press</Link>
              <Link to="/initiatives">Initiatives</Link>

              <button onClick={() => setIsAuthenticated(false)}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <Home
                // setIsAuthenticated={setIsAuthenticated}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/statements" element={<Statements />} />

          <Route path="/edit-statements" element={<EditStatements />} />

          <Route path="/press" element={<Press />} />

          <Route path="/edit-press" element={<EditPress />} />

          <Route path="/initiatives" element={<Initiatives />} />
          <Route
            path="/edit-initiatives"
            element={<EditInitatives />} // Assuming you have an edit component for initiatives
          />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
    </>
  );
}

export default App;
