import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/LoanDocs.css";
import axios from "axios";

const LoanDocs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loanType, applicationNumber } = location.state || {};

  const [submittedDocs, setSubmittedDocs] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("");

  const documentsRequired = {
    "Personal Loan": {
      "Identity Proof": ["Aadhaar Card", "Passport", "Voter ID", "Driving License"],
      "Address Proof": ["Utility Bills (Electricity/Water/Gas)", "Rental Agreement", "Passport"],
      "Income Proof": ["Salary Slips (Last 3 months)", "Bank Statement (Last 6 months)", "Form 16"],
      "Other": ["PAN Card", "2 Passport-size Photographs"],
    },
    "Business Loan": {
      "Business Documents": ["Business Registration Certificate", "GST Registration", "Business PAN Card"],
      "Financial Documents": ["ITR of last 2 years", "Balance Sheet & Profit/Loss Statement", "Bank Statement (Last 12 months)"],
      "KYC Documents": ["Aadhaar Card", "Voter ID", "Driving License"],
    },
    "Home Loan": {
      "Personal Documents": ["Aadhaar Card", "PAN Card", "Passport-size Photographs"],
      "Income Proof": ["Salary Slips", "ITR of last 3 years", "Bank Statement (Last 12 months)"],
      "Property Documents": ["Sale Deed", "Property Tax Receipts", "NOC from Builder/Society"],
    },
    "Educational Loan": {
      "Student Applicant": ["Aadhaar Card", "10th & 12th Marksheet", "College Admission Letter"],
      "Co-Applicant / Guarantor": ["PAN Card", "Salary Slips / ITR", "Bank Statement (6 months)"],
      "Other Documents": ["Passport-size Photographs", "Fee Structure of College"],
    },
  };

  const handleDocsSubmit = async (e) => {
    e.preventDefault();
    if (!loanType || !applicationNumber) return;

    const formData = new FormData();
    const inputs = document.querySelectorAll(".loan-docs-grid input[type='file']");
    inputs.forEach((input) => {
      if (input.files[0]) {
        formData.append("files", input.files[0]); // ✅ exact match with @RequestParam
      }
    });

    try {
      await axios.post(
        `http://localhost:8081/api/loans/docs/upload/${applicationNumber}`, // ✅ fixed
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Documents uploaded successfully!");
      setSubmittedDocs(true);
    } catch (err) {
      console.error(err);
      alert("Error uploading documents!");
    }
  };

  const handleVerification = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8081/api/loans/docs/verify/${applicationNumber}` // ✅ fixed
      );
      setVerificationStatus(res.data.status);

      alert(`Documents for Application #${applicationNumber} have been ${res.data.status}`);
    } catch (err) {
      console.error(err);
      alert("Verification failed!");
    }
  };

  const handleStartProcess = () => {
    if (verificationStatus === "approved") {
      alert(`Further process started for Application: ${applicationNumber}`);
      navigate("/dashboard");
    } else {
      alert("You cannot proceed until documents are approved.");
    }
  };

  return (
    <div className="loan-docs-container">
      <h2 className="page-title">
        {loanType ? `${loanType} - Required Documents` : "Loan Documents"}
      </h2>

      {/* ✅ Show Application Number here */}
      {applicationNumber && (
        <p className="app-number">📌 Application Number: <strong>{applicationNumber}</strong></p>
      )}

      {!loanType ? (
        <p className="error-text">
          No loan type selected. Please go back and apply for a loan.
        </p>
      ) : (
        <form className="docs-form" onSubmit={handleDocsSubmit}>
          {Object.entries(documentsRequired[loanType] || {}).map(([section, docs]) => (
            <div key={section} className="loan-section">
              <h3>{section}</h3>
              <div className="loan-docs-grid">
                {docs.map((doc, index) => (
                  <div key={index} className="loan-doc">
                    <label>{doc}</label>
                    <input type="file" accept=".pdf,.jpg,.png" required />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button type="submit" className="loan-submit-btn">
            Submit Documents
          </button>
        </form>
      )}

      {submittedDocs && !verificationStatus && (
        <button className="verify-btn" onClick={handleVerification}>
          Send for Verification
        </button>
      )}

      {verificationStatus === "approved" && (
        <p className="success-text">✅ Documents Submitted.</p>
      )}
      {verificationStatus === "rejected" && (
        <p className="error-text">❌ Documents rejected. Please re-upload.</p>
      )}

      {verificationStatus === "approved" && (
        <button className="start-btn" onClick={handleStartProcess}>
          Start Further Process
        </button>
      )}
    </div>
  );
};

export default LoanDocs;
