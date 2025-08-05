import "../styles/Home.css"; // Assuming you have a CSS file for styling

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
        <a className="button" style={{ marginTop: "10px" }} href="/login">
          Login
        </a>
      )}
    </div>
  );
}
