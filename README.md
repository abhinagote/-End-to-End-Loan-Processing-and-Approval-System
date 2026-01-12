
# End-to-End Loan Processing and Approval System

# Overview

**End-to-End Loan Processing and Approval System** automates the loan lifecycle from application submission through workflow-driven approvals. It integrates a BPM engine (Camunda) to model approval flows (BPMN), provides a React manager dashboard for task handling, and a Spring Boot REST API for business logic and persistence.

Key goals:

* Automate task assignment and state transitions using BPMN.
* Provide role-based UI for Managers (approve/reject), Applicants, and Admin.
* Keep the system modular and Docker-friendly for easy deployment.

---

# Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Getting Started (Local)](#getting-started-local)
6. [Configuration / Environment Variables](#configuration--environment-variables)
7. [Database Schema (Example)](#database-schema-example)
8. [Workflow (BPMN) Example](#workflow-bpmn-example)
9. [API Reference (Selected Endpoints)](#api-reference-selected-endpoints)
10. [Frontend Snippets & UX Flow](#frontend-snippets--ux-flow)
11. [Docker / Docker Compose](#docker--docker-compose)
14. [Future Enhancements](#future-enhancements)
16. [License & Author](#license--author)

---

# Features

* Submit loan applications (applicant).
* Create BPMN workflow instance per application.
* Manager task list (pending approvals).
* Approve / Reject actions that:

  * Complete the Camunda task
  * Update loan state in database
* Audit trail / task history via Camunda history.
* Basic notifications (UI messages; optional email/SMS hooks).
* Internationalized UI (i18next).
* Configurable DB (MySQL or PostgreSQL).

---

# Architecture

```
+-------------+        +----------------------+         +------------+
|  Frontend   | <----> |  Backend (Spring)    | <-----> |   DB       |
|  (React)    |  REST  |  + Camunda Integration|         | MySQL/PG   |
+-------------+        +----------------------+         +------------+
        ^                       ^
        |                       |
        |                       +--> Camunda BPM (embedded or external)
        |
  Manager UI -> fetch tasks -> /api/loans/tasks/manager
```

* **Frontend**: React app communicates over REST.
* **Backend**: Spring Boot app exposes REST APIs, interacts with Camunda to create instances and complete tasks, persists loan state in DB.
* **Camunda**: Either embedded in the Spring Boot app (recommended for simple setups) or run as a separate service (recommended for production).

---

# Tech Stack

**Frontend**

* React.js (functional components + hooks)
* axios (HTTP client)
* i18next (i18n)
* CSS (or Tailwind/Bootstrap optional)

**Backend**

* Java 11+ (or 17)
* Spring Boot (2.5+ or 3.x)
* Spring Data JPA
* Camunda BPM (7.x or 8.x—this README assumes Camunda 7.x model; adapt if using Zeebe/Camunda 8)
* Maven/Gradle

**Database**

* MySQL 8+ OR PostgreSQL 12+

**Dev / Ops**

* Docker & Docker Compose
* Postman or curl for API testing

---

# Project Structure (recommended)

```
/frontend
  /public
  /src
    /components
      ManagerApproval.jsx
      LoanForm.jsx
    /services
      api.js
    App.js
    index.js
/backend
  /src/main/java/com/example/loan
    controller
      LoanController.java
      TaskController.java
    service
      LoanService.java
      CamundaService.java
    entity
      LoanApplication.java
      User.java
    repository
      LoanRepository.java
    workflow
      bpmn/loan-approval.bpmn
  /src/main/resources
    application.yml
docker-compose.yml
README.md
```

---

# Getting Started (Local)

> These steps assume you have Node.js, Java JDK, Maven, and Docker installed.

## 1. Clone

```bash
git clone <YOUR_REPO_URL>
cd your-repo
```

## 2. Backend: Build & Run

**Option A — Local (Camunda embedded)**
Edit `backend/src/main/resources/application.yml` (DB config), then:

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Option B — Docker Compose** (see Docker section below)

```bash
docker-compose up --build
```

## 3. Frontend

```bash
cd frontend
npm install
npm start
# App runs at http://localhost:3000 by default
```

---

# Configuration / Environment Variables

Place in `application.yml` or environment variables for Docker.

Example `application.yml` essentials:

```yaml
spring:
  datasource:
    url: jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME:loan_db}
    username: ${DB_USER:root}
    password: ${DB_PASSWORD:root}
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

camunda:
  bpm:
    enabled: true
    history-level: audit
    # if external engine: configure REST client or remote connector
```

**Env variables to set**

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=loan_db
DB_USER=root
DB_PASSWORD=root
SPRING_PROFILES_ACTIVE=dev
CAMUNDA_REST_URL=http://camunda:8080/engine-rest  # if external
```

---

# Database Schema (Example)

SQL for loan table (simple):

```sql
CREATE TABLE loan_application (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  application_number VARCHAR(50) UNIQUE NOT NULL,
  applicant_name VARCHAR(255),
  amount DECIMAL(15,2),
  term_months INT,
  status VARCHAR(50) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  camunda_process_instance_id VARCHAR(64)
);
```

Entities (Java):

```java
@Entity
public class LoanApplication {
  @Id @GeneratedValue
  private Long id;
  @Column(unique=true)
  private String applicationNumber;
  private String applicantName;
  private BigDecimal amount;
  private Integer termMonths;
  private String status; // PENDING, APPROVED, REJECTED
  private String camundaProcessInstanceId;
  // getters/setters
}
```

---

# Workflow (BPMN) Example

Create a simple BPMN `loan-approval.bpmn`:

* Start Event -> User Task (Manager Review) -> Exclusive Gateway:

  * Approve -> Service Task (update loan to APPROVED) -> End
  * Reject -> Service Task (update loan to REJECTED) -> End

XML snippet (conceptual):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions ...>
  <bpmn:process id="loanApprovalProcess" isExecutable="true">
    <bpmn:startEvent id="Start" />
    <bpmn:userTask id="ManagerReview" name="Manager Review" camunda:assignee="manager" />
    <bpmn:exclusiveGateway id="Decision" />
    <bpmn:sequenceFlow sourceRef="ManagerReview" targetRef="Decision" />
    <bpmn:sequenceFlow id="approveFlow" sourceRef="Decision" targetRef="ServiceApprove">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">${approved == true}</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:serviceTask id="ServiceApprove" name="Mark Loan Approved" camunda:class="com.example.loan.workflow.ApproveLoanDelegate"/>
    <bpmn:sequenceFlow sourceRef="ServiceApprove" targetRef="End"/>
    <bpmn:endEvent id="End"/>
  </bpmn:process>
</bpmn:definitions>
```

In Spring Boot you can wire a JavaDelegate to update loan status when the service task runs.

---

# API Reference (Selected endpoints)

All endpoints under `/api/loans` unless otherwise noted.

### 1. Get manager tasks

**GET** `/api/loans/tasks/manager`
Response:

```json
[
  {
    "id": "taskId-123",
    "applicationNumber": "APP-2026-0001",
    "name": "Manager Review - Loan #APP-2026-0001",
    "created": "2026-01-10T10:00:00Z"
  }
]
```

### 2. Complete Camunda task

**POST** `/api/loans/tasks/{taskId}/complete?approved=true|false`

* Completes the Camunda user task and sets process variables.

### 3. Approve loan (business API)

**POST** `/api/loans/approve/{applicationNumber}`
Response: `200 OK` with updated loan entity.

### 4. Reject loan (business API)

**POST** `/api/loans/reject/{applicationNumber}`

### 5. Submit application

**POST** `/api/loans`
Request:

```json
{
  "applicantName": "Jane Doe",
  "amount": 250000,
  "termMonths": 36
}
```

Response:

* `201 Created`, includes `applicationNumber` and `camundaProcessInstanceId`.

---

# Frontend Snippets & UX Flow

ManagerApproval component (core idea):

```jsx
useEffect(() => { fetchTasks(); }, []);

<select onChange={...}>
  <option value="">{t("select")}</option>
  {tasks.map(task => <option value={task.id}>{task.applicationNumber} — {task.name}</option>)}
</select>

<form onSubmit={handleSubmit}>
  <input type="radio" name="decision" value="approve" />
  <input type="radio" name="decision" value="reject" />
  <button disabled={!decision}>Submit</button>
</form>
```

`handleSubmit` flow:

1. POST `/api/loans/tasks/{taskId}/complete?approved=true|false`
2. POST `/api/loans/approve/{appNo}` OR `/api/loans/reject/{appNo}`
3. Refresh task list

UX tips:

* Show loader while fetching
* Confirm modal before final submit
* Optimistically update UI, but handle rollback for failures

---

# Docker / Docker Compose (example)

`docker-compose.yml` (conceptual):

```yaml
version: "3.8"
services:
  db:
    image: mysql:8
    environment:
      MYSQL_DATABASE: loan_db
      MYSQL_ROOT_PASSWORD: root
    ports: ["3306:3306"]
    volumes: ["db_data:/var/lib/mysql"]

  camunda:
    image: camunda/camunda-bpm-platform:run-latest
    ports: ["8080:8080"]
    environment:
      - DB_DRIVER=org.h2.Driver

  backend:
    build: ./backend
    ports: ["8081:8080"]
    environment:
      DB_HOST: db
      DB_PORT: 3306
      DB_NAME: loan_db
      DB_USER: root
      DB_PASSWORD: root
      CAMUNDA_REST_URL: http://camunda:8080/engine-rest
    depends_on:
      - db
      - camunda

  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      REACT_APP_API_URL: http://localhost:8081

volumes:
  db_data:
```

Run:

```bash
docker-compose up --build
```

# Future Enhancements

* Multi-level approvals (credit officer → manager → risk)
* Role-based authentication & authorization (JWT + Spring Security)
* Email/SMS notifications on task assignment
* Observability: metrics (Prometheus), logs (ELK)
* Add analytics dashboard for KPIs
* Support Camunda 8 (Zeebe) migration

---

# License

> This repository is for internship/demo purposes.

---

# Author / Contact

**Abhay Nagote** — Internship Project
Email: abhaynagote1235@gmail.com

---

