// LoanStatus.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/LoanStatus.css";
import { useTranslation } from "react-i18next";

const LoanStatus = () => {
  const { t } = useTranslation(); // i18n hook
  const [loans, setLoans] = useState([]);
  const [searchAppNo, setSearchAppNo] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchedLoan, setSearchedLoan] = useState(null);
  const [error, setError] = useState("");
  const [workflowStage, setWorkflowStage] = useState(""); // ✅ workflow state

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // Fetch user loans
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8081/api/loans/user/${userId}`)
        .then((res) => setLoans(res.data))
        .catch((err) => console.error("Error fetching loans:", err));
    }
  }, [userId]);

  const submittedLoans = loans.filter((loan) => loan.applicationNumber);

  // Live suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchAppNo(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = submittedLoans.filter((loan) =>
      loan.applicationNumber.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
  };

  // Fetch workflow stage
  const fetchWorkflowStage = async (appNo) => {
    try {
      const res = await axios.get(
        `http://localhost:8081/api/loans/${appNo}/workflow`
      );
      setWorkflowStage(res.data);
    } catch (err) {
      console.error("Error fetching workflow stage:", err);
      setWorkflowStage(t("loanStatus.workflowUnavailable"));
    }
  };

  // Search loan
  const handleSearch = (appNo) => {
    const found = submittedLoans.find(
      (loan) => loan.applicationNumber === appNo
    );
    if (found) {
      setSearchedLoan(found);
      setError("");
      setSearchAppNo(appNo);
      setSuggestions([]);
      fetchWorkflowStage(appNo); // ✅ fetch workflow when loan found
    } else {
      setSearchedLoan(null);
      setWorkflowStage(""); // reset if not found
      setError(t("loanStatus.applicationNotFound"));
    }
  };

  // Delete loan
  const handleDelete = () => {
    if (!searchedLoan) return;

    if (window.confirm(t("loanStatus.confirmDelete"))) {
      axios
        .delete(`http://localhost:8081/api/loans/${searchedLoan.id}`)
        .then(() => {
          alert(t("loanStatus.deleteSuccess"));
          setLoans(loans.filter((l) => l.id !== searchedLoan.id));
          setSearchedLoan(null);
          setSearchAppNo("");
          setWorkflowStage("");
        })
        .catch(() => alert(t("loanStatus.deleteFail")));
    }
  };

  // Navigate to update page with loan data
  const handleUpdateClick = (loan) => {
    navigate("/loan/update", { state: { loan } });
  };

  return (
    <div className="status-page">
      <h2>{t("loanStatus.title")}</h2>

      {submittedLoans.length === 0 ? (
        <p>{t("loanStatus.noApplications")}</p>
      ) : (
        <>
          {/* Search input */}
          <div className="search-box">
            <input
              type="text"
              placeholder={t("loanStatus.searchPlaceholder")}
              value={searchAppNo}
              onChange={handleInputChange}
            />
            <button onClick={() => handleSearch(searchAppNo)}>
              {t("loanStatus.searchButton")}
            </button>
          </div>

          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((loan) => (
                <li
                  key={loan.id}
                  onClick={() => handleSearch(loan.applicationNumber)}
                >
                  {loan.applicationNumber}
                </li>
              ))}
            </ul>
          )}

          {/* Error */}
          {error && <p className="error">{error}</p>}

          {/* Loan details */}
          {searchedLoan && (
            <div className="result-card">
              <p>
                <strong>{t("loanStatus.applicationNumber")}</strong>{" "}
                {searchedLoan.applicationNumber}
              </p>
              <p>
                <strong>{t("loanStatus.amount")}</strong> ₹
                {searchedLoan.loanAmount}
              </p>
              <p>
                <strong>{t("loanStatus.status")}</strong>{" "}
                {searchedLoan.submitted
                  ? t("loanStatus.statusSubmitted")
                  : t("loanStatus.statusDraft")}
              </p>
              <p>
                <strong>{t("loanStatus.city")}</strong> {searchedLoan.city}
              </p>
<p>
  <strong>{t("loanStatus.workflowStage")}:</strong>{" "}
  {workflowStage ? workflowStage : t("loanStatus.workflowLoading")}
</p>

              <div className="result-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => handleUpdateClick(searchedLoan)}
                >
                  {t("loanStatus.updateButton")}
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  {t("loanStatus.deleteButton")}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LoanStatus;
