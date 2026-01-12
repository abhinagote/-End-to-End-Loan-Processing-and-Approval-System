import React, { useState } from "react";
import axios from "axios";
import "./css/a.css";

const LoanStatus1 = () => {
  const [applicationNumber, setApplicationNumber] = useState("");
  const [status, setStatus] = useState(null);

  const checkStatus = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/api/loans/status/${applicationNumber}`);
      setStatus(res.data);
    } catch (err) {
      console.error("Error fetching status", err);
      setStatus({ status: "ERROR" });
    }
  };

  return (
    <div className="loan-status">
      <h2>Check Loan Application Status</h2>
      <input
        type="text"
        value={applicationNumber}
        onChange={(e) => setApplicationNumber(e.target.value)}
        placeholder="Enter Application Number"
      />
      <button onClick={checkStatus}>Check Status</button>

      {status && (
        <div className="status-result">
          <h3>Status: {status.status}</h3>
          {status.endTime && <p>Completed on: {new Date(status.endTime).toLocaleString()}</p>}
        </div>
      )}
    </div>
  );
};

export default LoanStatus1;
