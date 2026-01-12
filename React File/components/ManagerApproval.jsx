import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "./css/manager.css";

const ManagerApproval = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedAppNumber, setSelectedAppNumber] = useState("");
  const [decision, setDecision] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
const [workflowStage, setWorkflowStage] = useState("");

  // ✅ Wrapped in useCallback so it can be used in useEffect without warnings
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8081/api/loans/tasks/manager");
      setTasks(res.data || []);
    } catch (err) {
      console.error("Error fetching tasks", err);
      setMessage("❌ " + t("managerApproval.error"));
    } finally {
      setLoading(false);
    }

    // Optional extra fetch
    axios
      .get("http://localhost:8081/api/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, [t]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTask) {
      alert(t("managerApproval.errorSelectTask"));
      return;
    }

    try {
      const camundaUrl = `http://localhost:8081/api/loans/tasks/${selectedTask}/complete?approved=${
        decision === "approve"
      }`;
      const camundaRes = await axios.post(camundaUrl);

      if (camundaRes.status !== 200) {
        setMessage(t("managerApproval.failCompleteTask", { appNo: selectedAppNumber }));
        return;
      }

      const loanUrl =
        decision === "approve"
          ? `http://localhost:8081/api/loans/approve/${selectedAppNumber}`
          : `http://localhost:8081/api/loans/reject/${selectedAppNumber}`;

      const loanRes = await axios.post(loanUrl);

      if (loanRes.status === 200) {
        setMessage(t("managerApproval.success", { appNo: selectedAppNumber, decision }));
      } else {
        setMessage(t("managerApproval.failDecision", { appNo: selectedAppNumber, decision }));
      }

      setDecision("");
      setSelectedTask("");
      setSelectedAppNumber("");
      fetchTasks();
    } catch (err) {
      console.error("Error completing task", err);
      setMessage(t("managerApproval.error", { appNo: selectedAppNumber }));
    }
  };

  return (
    <div className="manager-approval">
      <h2>{t("managerApproval.title")}</h2>

      <section className="section">
        <h3>{t("managerApproval.pendingTasks")}</h3>
        {loading ? (
          <p>{t("managerApproval.loading")}</p>
        ) : tasks.length === 0 ? (
          <p>{t("managerApproval.noTasks")}</p>
        ) : (
          <select
            value={selectedTask}
            onChange={(e) => {
              const taskId = e.target.value;
              setSelectedTask(taskId);
              setMessage("");
              setDecision("");
              const task = tasks.find((t) => t.id === taskId);
              setSelectedAppNumber(task?.applicationNumber || "");
            }}
          >
            <option value="">{t("managerApproval.selectPlaceholder")}</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.applicationNumber} – {task.name}
              </option>
            ))}
          </select>
        )}
      </section>

      {selectedTask && selectedAppNumber && (
        <section className="section">
          <h3>{t("managerApproval.decisionFor", { appNo: selectedAppNumber })}</h3>
      <p>
  <strong>{t("loanStatus.workflowStage")}:</strong>{" "}
  {workflowStage ? workflowStage : t("loanStatus.workflowLoading")}
</p>

          <form onSubmit={handleSubmit}>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="approve"
                  checked={decision === "approve"}
                  onChange={(e) => setDecision(e.target.value)}
                />{" "}
                {t("managerApproval.approve")}
              </label>
              <label>
                <input
                  type="radio"
                  value="reject"
                  checked={decision === "reject"}
                  onChange={(e) => setDecision(e.target.value)}
                />{" "}
                {t("managerApproval.reject")}
              </label>
            </div>
            <button type="submit" disabled={!decision}>
              {t("managerApproval.submitButton")}
            </button>
          </form>
        </section>
      )}

      {message && (
        <section className="message">
          <p className={message.includes("✅") ? "success" : "error"}>{message}</p>
        </section>
      )}
    </div>
  );
};

export default ManagerApproval;
