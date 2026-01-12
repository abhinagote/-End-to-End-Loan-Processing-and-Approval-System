// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import UserSignUp from "./components/UserSignUP.jsx";
import Dashboard from "./components/Dashboard.jsx";
import LoanForm from "./components/LoanForm.jsx";
import LoanStatus from "./components/LoanStatus.jsx";
import Profile from "./components/Profile.jsx";
import Layout from "./components/Layout.jsx";  
import ManagerApproval from "./components/ManagerApproval.jsx";  
import LoanUpdateForm from "./components/LoanUpdateForm.jsx";
import RoleManagement from "./components/RoleManagement.jsx";

import LoanDocs from "./components/LoanDocs.jsx";
import VerificationApproval from "./components/VerificationApproval.jsx";
import ExternalTasks from "./components/ExternalTasks.jsx";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const role = localStorage.getItem("role"); // get role from login

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/Usersignup" element={<UserSignUp />} />

        {/* Protected routes */}
        {isAuthenticated ? (
          <Route element={<Layout setIsAuthenticated={setIsAuthenticated} />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* User Routes */}
            {role === "USER" && (
              <>
                <Route path="/apply-loan" element={<LoanForm />} />
                <Route path="/status" element={<LoanStatus />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/loan/docs" element={<LoanDocs />} />
                <Route path="/loan/update" element={<LoanUpdateForm />} />
              </>
            )}

            {/* Verification Officer Routes */}
            {role === "VERIFICATION" && (
              <Route path="/verification-approval" element={<VerificationApproval />} />
            )}

            {/* Manager Routes */}
            {role === "MANAGER" && (
              <Route path="/manager-approval" element={<ManagerApproval />} />
            )}

            {/* External Service Manager Routes */}
            {role === "SERVICE_MANAGER" && (
              <Route path="/external-tasks" element={<ExternalTasks />} />
            )}

            {/* Admin Routes */}
            {role === "ADMIN" && (
              <>
               <Route path="/role-management" element={<RoleManagement />} />
               <Route path="/signup-admin" element={<Signup />} /> {/* New route */}
               </>
            )}
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
