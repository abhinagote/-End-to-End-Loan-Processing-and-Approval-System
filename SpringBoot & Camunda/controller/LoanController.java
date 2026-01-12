package com.example.loan_management_system.controller;

import java.util.*;
import java.util.Base64;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.task.Task;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.loan_management_system.entity.Loan;
import com.example.loan_management_system.entity.LoanDocument;
import com.example.loan_management_system.entity.LoanStatusResponse;
import com.example.loan_management_system.repository.LoanRepository;
import com.example.loan_management_system.repository.LoanDocumentRepository;
import com.example.loan_management_system.service.LoanService;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = {"http://localhost:3000"})
public class LoanController {

    // 🔹 Constant keys for process variables
    private static final String VAR_LOAN_ID = "loanId";
    private static final String VAR_LOAN_AMOUNT = "loanAmount";
    private static final String VAR_APPLICATION_NUMBER = "applicationNumber";
    private static final String VAR_LOAN_TYPE = "loanType";
    private static final String VAR_APPROVED = "approved";
    private static final String VAR_VERIFICATION_APPROVED = "verificationApproved";

    private final LoanService loanService;
    private final RuntimeService runtimeService;
    private final TaskService taskService;
    private final LoanRepository loanRepository;
    private final LoanDocumentRepository loanDocumentRepository;

    public LoanController(LoanService loanService,
                          RuntimeService runtimeService,
                          TaskService taskService,
                          LoanRepository loanRepository,
                          LoanDocumentRepository loanDocumentRepository) {
        this.loanService = loanService;
        this.runtimeService = runtimeService;
        this.taskService = taskService;
        this.loanRepository = loanRepository;
        this.loanDocumentRepository = loanDocumentRepository;
    }

    // 🔹 Save draft loan
    @PostMapping("/save/{userId}")
    public Loan saveLoan(@PathVariable Long userId, @RequestBody Loan loan) {
        loan.setUserId(userId);
        loan.setSubmitted(false);
        return loanService.saveLoan(loan);
    }

    // 🔹 Submit loan and start BPMN process
    @PostMapping("/submit/{userId}")
    public Loan submitLoan(@PathVariable Long userId, @RequestBody Loan loan) {
        loan.setUserId(userId);
        Loan savedLoan = loanService.submitLoan(loan);

        Map<String, Object> variables = new HashMap<>();
        variables.put(VAR_LOAN_ID, savedLoan.getId());
        variables.put(VAR_LOAN_AMOUNT, savedLoan.getLoanAmount());
        variables.put(VAR_APPLICATION_NUMBER, savedLoan.getApplicationNumber());
        variables.put(VAR_LOAN_TYPE, savedLoan.getLoanType());

        runtimeService.startProcessInstanceByKey("LMS", savedLoan.getApplicationNumber(), variables);

        return savedLoan;
    }

    // 🔹 Get all loans for a user
    @GetMapping("/user/{userId}")
    public List<Loan> getLoansByUser(@PathVariable Long userId) {
        return loanService.getLoansByUser(userId);
    }

    // 🔹 Get all loans
    @GetMapping
    public List<Loan> getAllLoans() {
        return loanService.getAllLoans();
    }

    // 🔹 Get loan by ID
    @GetMapping("/{id}")
    public Loan getLoanById(@PathVariable Long id) {
        return loanService.getLoanById(id);
    }

    // 🔹 Update loan
    @PutMapping("/{id}")
    public Loan updateLoan(@PathVariable Long id, @RequestBody Loan loan) {
        return loanService.updateLoan(id, loan);
    }

    // 🔹 Delete loan
    @DeleteMapping("/{id}")
    public String deleteLoan(@PathVariable Long id) {
        loanService.deleteLoan(id);
        return "Loan deleted successfully!";
    }

    // 🔹 Get pending manager tasks
    @GetMapping("/tasks/manager")
    public List<Map<String, Object>> getManagerTasks() {
        List<Task> tasks = taskService.createTaskQuery()
                .taskCandidateGroup("manager")
                .list();

        List<Map<String, Object>> response = new ArrayList<>();
        for (Task task : tasks) {
            Map<String, Object> taskData = new HashMap<>();
            taskData.put("id", task.getId());
            taskData.put("name", task.getName());
            taskData.put("processInstanceId", task.getProcessInstanceId());

            Map<String, Object> variables = runtimeService.getVariables(task.getProcessInstanceId());
            if (variables.containsKey(VAR_APPLICATION_NUMBER)) {
                taskData.put(VAR_APPLICATION_NUMBER, variables.get(VAR_APPLICATION_NUMBER));
            }

            response.add(taskData);
        }
        return response;
    }

    // 🔹 Complete a manager task (Approve / Reject)
    @PostMapping("/tasks/{taskId}/complete")
    public String completeTask(@PathVariable String taskId, @RequestParam boolean approved) {
        Map<String, Object> variables = new HashMap<>();
        variables.put(VAR_APPROVED, approved);
        taskService.complete(taskId, variables);

        return "Task " + taskId + " completed with decision: " + (approved ? "APPROVED" : "REJECTED");
    }

    // 🔹 Get verification tasks
    @GetMapping("/tasks/verification")
    public List<Map<String, Object>> getVerificationTasks() {
        List<Task> tasks = taskService.createTaskQuery()
                .taskCandidateGroup("verifiers")
                .list();

        List<Map<String, Object>> response = new ArrayList<>();
        for (Task task : tasks) {
            Map<String, Object> taskData = new HashMap<>();
            taskData.put("taskId", task.getId());
            taskData.put("taskName", task.getName());
            taskData.put(VAR_APPLICATION_NUMBER, runtimeService.getVariable(task.getProcessInstanceId(), VAR_APPLICATION_NUMBER));
            taskData.put(VAR_LOAN_TYPE, runtimeService.getVariable(task.getProcessInstanceId(), VAR_LOAN_TYPE));
            response.add(taskData);
        }
        return response;
    }

    // 🔹 Complete verification task
    @PostMapping("/tasks/verification/{taskId}/complete")
    public ResponseEntity<String> completeVerificationTask(
            @PathVariable String taskId,
            @RequestParam boolean verificationApproved) {

        try {
            Map<String, Object> variables = new HashMap<>();
            variables.put(VAR_VERIFICATION_APPROVED, verificationApproved);
            taskService.complete(taskId, variables);

            return ResponseEntity.ok(
                    "Verification Task " + taskId + " completed with decision: " +
                            (verificationApproved ? "APPROVED" : "REJECTED")
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error completing task: " + e.getMessage());
        }
    }

    // 🔹 Upload documents
    @PostMapping("/docs/upload/{applicationNumber}")
    public ResponseEntity<String> uploadDocs(
            @PathVariable String applicationNumber,
            @RequestParam("files") MultipartFile[] files) {

        Loan loan = loanRepository.findByApplicationNumber(applicationNumber)
                .orElse(null);

        if (loan == null) {
            return ResponseEntity.badRequest().body("Loan not found for application: " + applicationNumber);
        }

        for (MultipartFile file : files) {
            try {
                LoanDocument doc = new LoanDocument();
                doc.setLoan(loan);
                doc.setFileName(file.getOriginalFilename());
                doc.setContent(file.getBytes());
                loanDocumentRepository.save(doc);
            } catch (Exception e) {
                return ResponseEntity.internalServerError().body("Failed to save file: " + file.getOriginalFilename());
            }
        }

        return ResponseEntity.ok("Files uploaded successfully for " + applicationNumber);
    }

    // 🔹 Verify documents (dummy logic)
    @PostMapping("/docs/verify/{applicationNumber}")
    public ResponseEntity<Map<String, String>> verifyDocs(@PathVariable String applicationNumber) {
        boolean isApproved = true;

        Map<String, String> response = new HashMap<>();
        response.put("status", isApproved ? "approved" : "rejected");

        return ResponseEntity.ok(response);
    }

    // 🔹 Workflow stage for loan
    @GetMapping("/{appNo}/workflow")
    public String getWorkflowStage(@PathVariable String appNo) {
        var instance = runtimeService.createProcessInstanceQuery()
                .processInstanceBusinessKey(appNo)
                .singleResult();

        if (instance != null) {
            Task task = taskService.createTaskQuery()
                    .processInstanceId(instance.getProcessInstanceId())
                    .singleResult();

            if (task != null) {
                return task.getName(); // ✅ actual BPMN stage
            } else {
                return "In Progress (no active task)";
            }
        } else {
            return "Completed";
        }
    }

    // 🔹 Fetch documents (Base64 encoded for frontend)
    @GetMapping("/docs/{applicationNumber}")
    public ResponseEntity<List<Map<String, Object>>> getDocsByApplication(
            @PathVariable String applicationNumber) {

        Loan loan = loanRepository.findByApplicationNumber(applicationNumber).orElse(null);
        if (loan == null) return ResponseEntity.notFound().build();

        List<Map<String, Object>> docs = new ArrayList<>();
        loanDocumentRepository.findByLoan(loan).forEach(d -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", d.getId());
            map.put("fileName", d.getFileName());
            map.put("content", Base64.getEncoder().encodeToString(d.getContent()));
            docs.add(map);
        });

        return ResponseEntity.ok(docs);
    }

    // 🔹 Loan + workflow status
    @GetMapping("/user/{userId}/status")
    public List<LoanStatusResponse> getLoansWithStatus(@PathVariable Long userId) {
        List<Loan> loans = loanRepository.findByUserId(userId);
        List<LoanStatusResponse> response = new ArrayList<>();

        for (Loan loan : loans) {
            String status = "Not Started";
            String appNo = loan.getApplicationNumber();

            if (appNo != null) {
                var instance = runtimeService.createProcessInstanceQuery()
                        .processInstanceBusinessKey(appNo)
                        .singleResult();

                if (instance != null) {
                    Task task = taskService.createTaskQuery()
                            .processInstanceId(instance.getProcessInstanceId())
                            .singleResult();

                    if (task != null) {
                        status = task.getName();
                    } else {
                        status = "In Progress (no active task)";
                    }
                } else {
                    status = "Completed";
                }
            }

            response.add(new LoanStatusResponse(
                    loan.getId(),
                    loan.getApplicationNumber(),
                    loan.getLoanAmount(),
                    loan.getCity(),
                    status
            ));
        }

        return response;
    }
}
