// import React from "react";
import "../styles/Home.css"; // Assuming you have a CSS file for styling
import { Button } from "@mui/material";

export default function Home({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  return (
    <div className="home-content">
      <h1>Welcome to the Initiative Dashboard</h1>
      <p>Welcome to the home page!</p>

      {isAuthenticated ? (
        <p>You are logged in. You can now access the statements page.</p>
      ) : (
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "10px" }}
          href="/login"
        >
          Login
        </Button>
      )}
    </div>
  );
}
