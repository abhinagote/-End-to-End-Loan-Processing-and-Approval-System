import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next"; // ✅ translation hook
import "./css/Profile.css";

const Profile = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setError(t("profile.errorNotLoggedIn"));
      setLoading(false);
      return;
    }

    // Fetch user details
    axios
      .get(`http://localhost:8081/api/profile/${userId}`)
      .then((response) => {
        setProfile(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError(t("profile.errorFailedLoad"));
        setLoading(false);
      });

    // Fetch user loans
    axios
      .get(`http://localhost:8081/api/profile/${userId}/loans`)
      .then((response) => setLoans(response.data))
      .catch(() => console.error("Failed to fetch loans"));
  }, [userId, t]);

  if (loading) return <p>{t("profile.loading")}</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const filteredLoans = loans.filter(
    (loan) => loan.applicationNumber && loan.applicationNumber.trim() !== ""
  );

  return (
    <div className="profile-page">
      <h2 className="profile-title">{t("profile.title")}</h2>

      {profile && (
        <div className="profile-details">
          <p>
            <strong>{t("profile.name")}:</strong> {profile.name}
          </p>
          <p>
            <strong>{t("profile.email")}:</strong> {profile.email}
          </p>
        </div>
      )}

      <h3 className="loan-title">{t("profile.loansTitle")}</h3>
      {filteredLoans.length > 0 ? (
        <div className="loan-grid">
          {filteredLoans.map((loan) => (
            <div key={loan.id} className="loan-card">
              <p>
                <strong>{t("profile.applicationNumber")}:</strong> {loan.applicationNumber}
              </p>
              <p>
                <strong>{t("profile.amount")}:</strong> ₹{loan.loanAmount}
              </p>
              <p>
                <strong>{t("profile.status")}:</strong>{" "}
                {loan.submitted ? t("profile.statusSubmitted") : t("profile.statusDraft")}
              </p>
              <p>
                <strong>{t("profile.city")}:</strong> {loan.city}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>{t("profile.noLoans")}</p>
      )}
    </div>
  );
};

export default Profile;