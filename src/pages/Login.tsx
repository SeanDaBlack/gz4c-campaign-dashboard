// import React from "react";
import "../styles/Login.css"; // Assuming you have a CSS file for styling
import { useNavigate } from "react-router-dom"; // Add this import

import { Button } from "@mui/material";

// Simple base64 encoding (not secure, but obfuscated)
const ENCODED_PASSWORD = "cGFzc3dvcmQxMjM="; // base64 of ""

function handleLogin(value: string) {
  console.log("Login attempt with password:", value);

  // Decode the stored password
  const expectedPassword = atob(ENCODED_PASSWORD);

  return value === expectedPassword;
}

export default function Login({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (auth: boolean) => void;
}) {
  const navigate = useNavigate(); // Add this hook

  return (
    <>
      <div className="login-content">
        <h1>Login</h1>
        <p>Please enter your credentials to log in.</p>
        <form>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginTop: "10px" }}
            onClick={(e) => {
              e.preventDefault();
              // Handle login logic here
              console.log("Login button clicked");
              const passwordInput = document.getElementById(
                "password"
              ) as HTMLInputElement;

              if (handleLogin(passwordInput?.value || "")) {
                setIsAuthenticated(true);
                // Redirect to home or dashboard page
                navigate("/");
              } else {
                alert("Invalid credentials, please try again.");
              }
            }}
          >
            Login
          </Button>
        </form>
      </div>
    </>
  );
}
