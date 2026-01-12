import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./css/LoanUpdateForm.css";

const LoanUpdateForm = ({ onUpdateSuccess }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const loanFromState = location.state?.loan;

  const [formData, setFormData] = useState({
    applicantName: "",
    applicationNumber: "",
    loanAmount: "",
    yearlyIncome: "",
    profession: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    street1: "",
    street2: "",
    status: ""
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"

  // Pre-fill form if loan exists
  useEffect(() => {
    if (loanFromState) {
      setFormData({
        applicantName: loanFromState.applicantName || "",
        applicationNumber: loanFromState.applicationNumber || "",
        loanAmount: loanFromState.loanAmount || "",
        yearlyIncome: loanFromState.yearlyIncome || "",
        profession: loanFromState.profession || "",
        phone: loanFromState.phone || "",
        email: loanFromState.email || "",
        city: loanFromState.city || "",
        state: loanFromState.state || "",
        country: loanFromState.country || "",
        pincode: loanFromState.pincode || "",
        street1: loanFromState.street1 || "",
        street2: loanFromState.street2 || "",
        status: loanFromState.status || ""
      });
    }
  }, [loanFromState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loanFromState) return;

    try {
      const res = await axios.put(
        `http://localhost:8081/api/loans/${loanFromState.id}`,
        formData
      );
      setMessage(t("loanUpdate.success"));
      setMessageType("success");

      if (onUpdateSuccess) onUpdateSuccess(res.data);
      navigate("/status"); // Redirect to LoanStatus after update
    } catch (err) {
      console.error("Failed to update loan", err);
      setMessage(t("loanUpdate.fail"));
      setMessageType("error");
    }
  };

  return (
    <div className="loan-form-container">
      <h2 className="form-title">{t("loanUpdate.title")}</h2>

      {message && (
        <p className={messageType === "success" ? "success" : "error"}>{message}</p>
      )}

      <form onSubmit={handleSubmit} className="loan-form-grid">
        {/* Grid 1: Applicant & Loan Details */}
        <div className="form-grid">
          <label>{t("loanUpdate.applicantName")}</label>
          <input
            type="text"
            name="applicantName"
            value={formData.applicantName}
            onChange={handleChange}
            required
          />

          <label>{t("loanUpdate.loanAmount")}</label>
          <input
            type="number"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleChange}
            required
          />

          <label>{t("loanUpdate.yearlyIncome")}</label>
          <input
            type="number"
            name="yearlyIncome"
            value={formData.yearlyIncome}
            onChange={handleChange}
          />

          <label>{t("loanUpdate.profession")}</label>
          <input
            type="text"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
          />

          <label>{t("loanUpdate.phone")}</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label>{t("loanUpdate.email")}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Grid 2: Address & Status */}
        <div className="form-grid">
          <label>{t("loanUpdate.street1")}</label>
          <input
            type="text"
            name="street1"
            value={formData.street1}
            onChange={handleChange}
          />

          <label>{t("loanUpdate.street2")}</label>
          <input
            type="text"
            name="street2"
            value={formData.street2}
            onChange={handleChange}
          />

          <label>{t("loanUpdate.city")}</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />

          <label>{t("loanUpdate.state")}</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />

          <label>{t("loanUpdate.country")}</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />

          <label>{t("loanUpdate.pincode")}</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
          />

          <label>{t("loanUpdate.status")}</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">{t("loanUpdate.select")}</option>
            <option value="SUBMITTED">{t("loanUpdate.submitted")}</option>
            <option value="APPROVED">{t("loanUpdate.approved")}</option>
            <option value="REJECTED">{t("loanUpdate.rejected")}</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">
          {t("loanUpdate.updateButton")}
        </button>
      </form>
    </div>
  );
};

export default LoanUpdateForm;
