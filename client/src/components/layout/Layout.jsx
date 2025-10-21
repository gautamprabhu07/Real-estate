import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import "./layout.scss";

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

export default Layout;