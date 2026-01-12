import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "./css/VerificationApproval.css";

const VerificationApproval = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [docDecisions, setDocDecisions] = useState({});
  const [decision, setDecision] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalDoc, setModalDoc] = useState(null);

  const fetchTasks = () => {
    setLoading(true);
    axios
      .get("http://localhost:8081/api/tasks/verification")
      .then((res) => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSelectTask = (taskId) => {
    const task = tasks.find((t) => t.taskId === taskId);
    setSelectedTask(task);
    setUploadedDocs([]);
    setDocDecisions({});

    axios
      .get(`http://localhost:8081/api/loans/docs/${task.applicationNumber}`)
      .then((res) => {
        setUploadedDocs(res.data);
        const initialDecisions = {};
        res.data.forEach((doc) => (initialDecisions[doc.id] = true));
        setDocDecisions(initialDecisions);
      })
      .catch((err) => console.error("Error fetching uploaded docs:", err));
  };

  const handleDocDecision = (docId, approved) => {
    setDocDecisions((prev) => ({ ...prev, [docId]: approved }));
  };

  const allDocsApproved =
    uploadedDocs.length > 0 &&
    Object.values(docDecisions).every((val) => val === true);

  const handleDecision = async () => {
    if (!selectedTask || !decision) {
      setMessage(t("verificationApproval.errorSelectDecision"));
      return;
    }

    try {
      await axios.post(
        `http://localhost:8081/api/loans/tasks/verification/${selectedTask.taskId}/complete`,
        null,
        { params: { verificationApproved: decision === "approved" } }
      );

      setMessage(t("verificationApproval.success", { decision }));
      setSelectedTask(null);
      setUploadedDocs([]);
      setDecision("");
      setDocDecisions({});
      fetchTasks();
    } catch (err) {
      console.error("Error completing task:", err);
      setMessage(t("verificationApproval.fail"));
    }
  };

  return (
    <div className="verification-approval">
      <h2>{t("verificationApproval.title")}</h2>

      {loading ? (
        <p>{t("verificationApproval.loading")}</p>
      ) : tasks.length === 0 ? (
        <p>{t("verificationApproval.noTasks")}</p>
      ) : (
        <div className="task-dropdown">
          <label>{t("verificationApproval.selectApp")}</label>
          <select
            value={selectedTask?.taskId || ""}
            onChange={(e) => handleSelectTask(e.target.value)}
          >
            <option value="">{t("verificationApproval.selectPlaceholder")}</option>
            {tasks.map((task) => (
              <option key={task.taskId} value={task.taskId}>
                #{task.applicationNumber} ({task.loanType})
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedTask && uploadedDocs.length > 0 && (
        <div className="task-details">
          <h3>Application #{selectedTask.applicationNumber}</h3>

          <div className="uploaded-docs">
            <h4>{t("verificationApproval.uploadedDocs")}</h4>
            <div className="docs-grid">
              {uploadedDocs.map((doc) => {
                const fileType = doc.fileName.split(".").pop().toLowerCase();
                const fileUrl = `data:application/octet-stream;base64,${doc.content}`;

                return (
                  <div key={doc.id} className="doc-card">
                    <p>
                      <strong>{doc.fileName}</strong>
                    </p>

                    {fileType === "pdf" ? (
                      <iframe
                        src={fileUrl}
                        title={doc.fileName}
                        className="doc-preview"
                        onClick={() => setModalDoc({ fileUrl, fileType })}
                      />
                    ) : (
                      <img
                        src={fileUrl}
                        alt={doc.fileName}
                        className="doc-preview"
                        onClick={() => setModalDoc({ fileUrl, fileType })}
                      />
                    )}

                    <div className="doc-checkboxes">
                      <label>
                        <input
                          type="radio"
                          name={`doc-${doc.id}`}
                          checked={docDecisions[doc.id] === true}
                          onChange={() => handleDocDecision(doc.id, true)}
                        />
                        {t("verificationApproval.approve")}
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`doc-${doc.id}`}
                          checked={docDecisions[doc.id] === false}
                          onChange={() => handleDocDecision(doc.id, false)}
                        />
                        {t("verificationApproval.reject")}
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="decision-section">
            <h3>{t("verificationApproval.finalDecision")}</h3>
            <select value={decision} onChange={(e) => setDecision(e.target.value)}>
              <option value="">{t("verificationApproval.selectPlaceholder")}</option>
              {allDocsApproved && <option value="approved">{t("verificationApproval.approve")}</option>}
              <option value="rejected">{t("verificationApproval.reject")}</option>
            </select>
            <button onClick={handleDecision}>{t("verificationApproval.submitButton")}</button>
          </div>
        </div>
      )}

      {message && <p className="status-msg">{message}</p>}

      {modalDoc && (
        <div className="modal-overlay" onClick={() => setModalDoc(null)}>
          <div
            className="modal-content"
            key={modalDoc.fileUrl}
            onClick={(e) => e.stopPropagation()}
          >
            {modalDoc.fileType === "pdf" ? (
              <iframe
                src={modalDoc.fileUrl}
                title="Document Preview"
                className="modal-preview"
              />
            ) : (
              <img src={modalDoc.fileUrl} alt="Document Preview" className="modal-preview" />
            )}
            <button className="modal-close" onClick={() => setModalDoc(null)}>
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationApproval;
