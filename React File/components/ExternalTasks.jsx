import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "./css/ExternalTasks.css";

const ExternalTasks = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [workerId, setWorkerId] = useState("my-worker-1");
  const [message, setMessage] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/engine-rest/external-task/fetchAndLock",
        {
          workerId: workerId,
          maxTasks: 10,
          usePriority: true,
          topics: [
            {
              topicName: "notify-verification",
              lockDuration: 10000,
              deserializeValues: true
            }
          ]
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.length > 0) {
        setTasks(res.data);
        setMessage(t("externalTasks.success", { taskId: res.data.length }));
      } else {
        setTasks([]);
        setMessage(t("externalTasks.noTasks"));
      }

      setSelectedTaskId("");
    } catch (err) {
      console.error("Fetch tasks error:", err);
      setMessage(t("externalTasks.failFetch"));
    }
  };

  const completeTask = async () => {
    if (!selectedTaskId) {
      setMessage(t("externalTasks.warnSelect"));
      return;
    }

    try {
      const variablesToSend = {
        verificationStatus: { value: "Approved", type: "String" }
      };

      await axios.post(
        `http://localhost:8080/engine-rest/external-task/${selectedTaskId}/complete`,
        { workerId: workerId, variables: variablesToSend },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(t("externalTasks.success", { taskId: selectedTaskId }));
      setTasks((prev) => prev.filter((t) => t.id !== selectedTaskId));
      setSelectedTaskId("");
    } catch (err) {
      console.error("Complete task error:", err);
      setMessage(t("externalTasks.failComplete"));
    }
  };

  return (
    <div className="external-tasks">
      <h2>{t("externalTasks.title")}</h2>

      <div className="controls">
        <label>{t("externalTasks.workerId")}</label>
        <input
          type="text"
          value={workerId}
          onChange={(e) => setWorkerId(e.target.value)}
        />
        <button onClick={fetchTasks}>{t("externalTasks.fetchButton")}</button>
      </div>

      {tasks.length > 0 && (
        <div className="task-dropdown">
          <label>{t("externalTasks.selectTask")}</label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
          >
            <option value="">{t("externalTasks.selectPlaceholder")}</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.variables.applicationNumber.value} | {t.variables.loanType.value}
              </option>
            ))}
          </select>
          <button onClick={completeTask}>{t("externalTasks.completeButton")}</button>
        </div>
      )}

      {message && <p className="status-msg">{message}</p>}
    </div>
  );
};

export default ExternalTasks;
