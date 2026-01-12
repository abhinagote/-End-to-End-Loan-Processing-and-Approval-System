import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";   // ✅ i18n hook
import "./css/LoanForm.css";
import countryData from "../data/countryData";

const LoanForm = () => {
  const { t } = useTranslation();  // ✅ translations
  const [loan, setLoan] = useState({
    applicantName: "",
    street1: "",
    street2: "",
    street3: "",
    landmark: "",
    state: "",
    city: "",
    country: "",
    pincode: "",
    phone: "",
    yearlyIncome: "",
    profession: "",
    email: "",
    dob: "",
    aadhar: "",
    pan: "",
    loanAmount: "",
    termInMonths: "",
    startDate: "",
    otp: "",
    loanType: "",
  });

  const [errors, setErrors] = useState({});
  const [applicationNumber, setApplicationNumber] = useState("");
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoan({ ...loan, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: false });
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setLoan({
      ...loan,
      country: selectedCountry,
      state: "",
      phone: countryData[selectedCountry]?.code || "",
    });
    setErrors({ ...errors, country: false });
  };

  // ✅ Validation
  const validate = () => {
    const requiredFields = [
      "applicantName",
      "street1",
      "state",
      "city",
      "country",
      "pincode",
      "phone",
      "yearlyIncome",
      "profession",
      "email",
      "dob",
      "aadhar",
      "pan",
      "loanAmount",
      "termInMonths",
      "startDate",
      "otp",
      "loanType",
    ];

    let newErrors = {};
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!loan[field]) {
        newErrors[field] = true;
        isValid = false;
      }
    });

    if (!isValid) {
      setErrors(newErrors);
      return false;
    }

    if (!/^[1-9][0-9]{5}$/.test(loan.pincode)) {
      alert(t("validation.pincode"));
      return false;
    }

    if (!/^\+[0-9]{1,3}[6-9][0-9]{9}$/.test(loan.phone)) {
      alert(t("validation.phone"));
      return false;
    }

    if (!loan.email.endsWith("@gmail.com")) {
      alert(t("validation.email"));
      return false;
    }

    const birthDate = new Date(loan.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      alert(t("validation.age"));
      return false;
    }

    if (!/^\d{12}$/.test(loan.aadhar)) {
      alert(t("validation.aadhar"));
      return false;
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(loan.pan)) {
      alert(t("validation.pan"));
      return false;
    }

    if (!/^\d{6}$/.test(loan.otp)) {
      alert(t("validation.otp"));
      return false;
    }

    if (isNaN(loan.loanAmount) || Number(loan.loanAmount) < 10000) {
      alert(t("validation.loanAmount"));
      return false;
    }

    if (
      isNaN(loan.termInMonths) ||
      Number(loan.termInMonths) < 12 ||
      Number(loan.termInMonths) > 360
    ) {
      alert(t("validation.termInMonths"));
      return false;
    }

    if (isNaN(loan.yearlyIncome) || Number(loan.yearlyIncome) < 50000) {
      alert(t("validation.yearlyIncome"));
      return false;
    }

    return true;
  };

  const userId = localStorage.getItem("userId");

  const handleSave = async () => {
    if (!validate()) return;
    try {
      await axios.post(`http://localhost:8081/api/loans/save/${userId}`, loan);
      setSaved(true);
      alert(t("messages.saved"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!saved) {
      alert(t("messages.saveFirst"));
      return;
    }
    if (!validate()) return;
    try {
      const res = await axios.post(`http://localhost:8081/api/loans/submit/${userId}`, loan);
      setApplicationNumber(res.data.applicationNumber);
      setSubmitted(true);
      alert(`${t("messages.submitted")} ${res.data.applicationNumber}`);

      navigate("/loan/docs", {
        state: { loanType: loan.loanType, applicationNumber: res.data.applicationNumber },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartProcess = () => {
    alert(`${t("messages.processStarted")} ${applicationNumber}`);
  };

  const handleClose = () => {
    setLoan({
      applicantName: "",
      street1: "",
      street2: "",
      street3: "",
      landmark: "",
      state: "",
      city: "",
      country: "",
      pincode: "",
      phone: "",
      yearlyIncome: "",
      profession: "",
      email: "",
      dob: "",
      aadhar: "",
      pan: "",
      loanAmount: "",
      termInMonths: "",
      startDate: "",
      otp: "",
      loanType: "",
    });
    setApplicationNumber("");
    setSaved(false);
    setSubmitted(false);
    alert(t("messages.closed"));
    navigate("/dashboard");
  };

  return (
    <div className="loan-form-container">
      <h2>{t("form.title")}</h2>

      <div className="form-grid">
        {/* Column 1 */}
        <div className="form-column">
          <div className="form-group">
            <label className="required">{t("form.fullName")}</label>
            <input name="applicantName" value={loan.applicantName} onChange={handleChange}
              className={errors.applicantName ? "input-error" : ""} />
          </div>
          <div className="form-group">
            <label className="required">{t("form.street1")}</label>
            <input name="street1" value={loan.street1} onChange={handleChange}
              className={errors.street1 ? "input-error" : ""} />
          </div>
          <div className="form-group">
            <label>{t("form.street2")}</label>
            <input name="street2" value={loan.street2} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{t("form.street3")}</label>
            <input name="street3" value={loan.street3} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{t("form.landmark")}</label>
            <input name="landmark" value={loan.landmark} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="required">{t("form.country")}</label>
            <select name="country" value={loan.country} onChange={handleCountryChange}
              className={errors.country ? "input-error" : ""}>
              <option value="">{t("form.selectCountry")}</option>
              {Object.keys(countryData).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="required">{t("form.state")}</label>
            <select name="state" value={loan.state} onChange={handleChange}
              className={errors.state ? "input-error" : ""}>
              <option value="">{t("form.selectState")}</option>
              {loan.country &&
                countryData[loan.country]?.states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
            </select>
          </div>
        </div>

        {/* Column 2 */}
        <div className="form-column">
          <div className="form-group">
            <label className="required">{t("form.city")}</label>
            <input name="city" value={loan.city} onChange={handleChange}
              className={errors.city ? "input-error" : ""} />
          </div>
          <div className="form-group">
            <label className="required">{t("form.pincode")}</label>
            <input type="text" name="pincode" value={loan.pincode} onChange={handleChange}
              className={errors.pincode ? "input-error" : ""} />
          </div>
          <div className="form-group">
            <label className="required">{t("form.phone")}</label>
            <input type="text" name="phone" value={loan.phone} onChange={handleChange}
              placeholder="+91XXXXXXXXXX"
              className={errors.phone ? "input-error" : ""} />
          </div>
          <div className="form-group">
            <label className="required">{t("form.otp")}</label>
            <input type="text" name="otp" value={loan.otp} onChange={handleChange}
              placeholder={t("form.otpPlaceholder")}
              className={errors.otp ? "input-error" : ""} />
          </div>
          <div className="form-group">
            <label className="required">{t("form.email")}</label>
            <input name="email" value={loan.email} onChange={handleChange}
              className={errors.email ? "input-error" : ""} />
          </div>
          <div className="form-group">
            <label className="required">{t("form.dob")}</label>
            <input type="date" name="dob" value={loan.dob} onChange={handleChange}
              className={errors.dob ? "input-error" : ""} />
          </div>
          <div className="form-group">
            <label className="required">{t("form.profession")}</label>
            <input name="profession" value={loan.profession} onChange={handleChange}
              className={errors.profession ? "input-error" : ""} />
          </div>
        </div>

        {/* Column 3 */}
        <div className="form-column">
          <div className="form-group">
            <label className="required">{t("form.yearlyIncome")}</label>
            <input type="text" name="yearlyIncome" value={loan.yearlyIncome} onChange={handleChange}
              className={errors.yearlyIncome ? "input-error" : ""} />
          </div>
          <div className="form-group">
            <label className="required">{t("form.aadhar")}</label>
            <input type="text" name="aadhar" value={loan.aadhar} onChange={handleChange}
              className={errors.aadhar ? "input-error" : ""} />
          </div>
          <div className="form-group">
            <label className="required">{t("form.pan")}</label>
            <input name="pan" value={loan.pan} onChange={handleChange}
              className={errors.pan ? "input-error" : ""} />
          </div>
          <div className="form-group">
            <label className="required">{t("form.loanAmount")}</label>
            <input type="text" name="loanAmount" value={loan.loanAmount} onChange={handleChange}
              className={errors.loanAmount ? "input-error" : ""} />
          </div>
          <div className="form-group">
            <label className="required">{t("form.term")}</label>
            <input type="text" name="termInMonths" value={loan.termInMonths} onChange={handleChange}
              className={errors.termInMonths ? "input-error" : ""} />
          </div>
          <div className="form-group">
            <label className="required">{t("form.startDate")}</label>
            <input type="date" name="startDate" value={loan.startDate} onChange={handleChange}
              className={errors.startDate ? "input-error" : ""} />
          </div>
          <div className="form-group">
            <label className="required">{t("form.loanType")}</label>
            <select
              name="loanType"
              value={loan.loanType}
              onChange={handleChange}
              className={errors.loanType ? "input-error" : ""}
            >
              <option value="">{t("form.selectLoanType")}</option>
              <option value="Personal Loan">{t("form.personalLoan")}</option>
              <option value="Business Loan">{t("form.businessLoan")}</option>
              <option value="Home Loan">{t("form.homeLoan")}</option>
              <option value="Educational Loan">{t("form.educationalLoan")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="button-group">
        <button className="save-btn" onClick={handleSave}>{t("buttons.save")}</button>
        <button className="submit-btn" onClick={handleSubmit}>{t("buttons.submit")}</button>
        {submitted && (
          <button className="start-btn" onClick={handleStartProcess}>{t("buttons.startProcess")}</button>
        )}
        <button className="close-btn" onClick={handleClose}>{t("buttons.close")}</button>
      </div>

      {applicationNumber && <p>{t("form.applicationNumber")}: {applicationNumber}</p>}
    </div>
  );
};

export default LoanForm;
