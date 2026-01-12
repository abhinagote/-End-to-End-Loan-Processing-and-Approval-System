import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";  // ✅ translation hook
import "./css/a.css";

const Header = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // ✅ logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();

    alert(t("logout") + " successful!");
    setIsAuthenticated(false);
    navigate("/");
  };

  // ✅ change language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="header">
      <div className="logo">🏦 {t("app.title")}</div>

      <nav className="nav">
        <ul>
          {/* ✅ Language Dropdown */}
          <li>
            <select
              className="language-select"
              onChange={(e) => changeLanguage(e.target.value)}
              defaultValue={i18n.language}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
            </select>
          </li>

          {/* ✅ Logout button */}
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              {t("logout")}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;