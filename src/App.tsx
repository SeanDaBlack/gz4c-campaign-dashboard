import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EditStatements from "./pages/EditStatements";
import Statements from "./components/Statements";
// import NotFound from "./pages/NotFound";

// import

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [selectedStatement, setSelectedStatement] = useState({
    title: "",
    description: "",
    imgSrc: "",
    statement: "",
    topics: [],
    date: "",
  });

  // if even not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Login setIsAuthenticated={setIsAuthenticated} />;
  }

  const onLoad = () => {
    const storedStatement = localStorage.getItem("currentStatement");
    if (storedStatement) {
      setSelectedStatement(JSON.parse(storedStatement));
    }
  };

  return (
    <>
      <div>
        <nav>
          {isAuthenticated ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/statements">Statements</Link>
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
                setIsAuthenticated={setIsAuthenticated}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/statements" element={<Statements />} />

          <Route
            path="/edit-statements"
            element={
              <EditStatements
                title={selectedStatement.title}
                description={selectedStatement.description}
                imgSrc={selectedStatement.imgSrc}
                statement={selectedStatement.statement}
                topics={selectedStatement.topics}
                date={selectedStatement.date}
              />
            }
          />

          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
    </>
  );
}

export default App;
