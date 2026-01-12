import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./css/a.css";

const Sidebar = () => {
  const { t } = useTranslation();
  const role = localStorage.getItem("role");

  return (
    <aside className="sidebar">
      <ul>
        <li><NavLink to="/dashboard">{t("home")}</NavLink></li>

        {/* USER links */}
        {role === "USER" && (
          <>
            <li><NavLink to="/apply-loan">{t("applyLoan")}</NavLink></li>
            <li><NavLink to="/status">{t("status")}</NavLink></li>
            <li><NavLink to="/profile">{t("profile")}</NavLink></li>
          </>
        )}

        {/* VERIFICATION Officer links */}
        {role === "VERIFICATION" && (
          <li><NavLink to="/verification-approval">{t("verificationApproval")}</NavLink></li>
        )}

        {/* MANAGER links */}
        {role === "MANAGER" && (
          <li><NavLink to="/manager-approval">{t("managerApproval")}</NavLink></li>
        )}

        {/* External Service Manager links */}
        {role === "SERVICE_MANAGER" && (
          <li><NavLink to="/external-tasks">{t("serviceTaskApproval")}</NavLink></li>
        )}

        {/* ADMIN links */}
        {role === "ADMIN" && (
          <>
            <li><NavLink to="/role-management">Role Management</NavLink></li>
            <li><NavLink to="/signup-admin">Create User</NavLink></li> {/* New link */}  </>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
