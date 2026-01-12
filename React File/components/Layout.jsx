import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
//import "./Layout.css";
import "./css/a.css";

const Layout = ({ setIsAuthenticated }) => {
  return (
    <div className="layout">
      {/* Top Header */}
      <Header setIsAuthenticated={setIsAuthenticated} />

      <div className="layout-body">
        {/* Left Drawer */}
        <Sidebar />

        {/* Right Main Content */}
        <main className="layout-content">
          <Outlet /> {/* ⬅️ will load ApplyLoan, Status, Profile etc. */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
