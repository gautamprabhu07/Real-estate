import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import "./layout.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}

function RequireAuth() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return <Navigate to="/login" />;
  else {
    return (
      <div className="layout">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    );
  }
}

export { Layout, RequireAuth };