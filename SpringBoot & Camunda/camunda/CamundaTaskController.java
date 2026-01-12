package com.example.loan_management_system.camunda;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.task.Task;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000") // ✅ Allow React frontend
public class CamundaTaskController {

    private final TaskService taskService;
    private final RuntimeService runtimeService;

    // 🔹 Constants for variable names (avoid duplication)
    private static final String VAR_TASK_ID = "taskId";
    private static final String VAR_TASK_NAME = "taskName";
    private static final String VAR_CREATED = "created";
    private static final String VAR_LOAN_TYPE = "loanType";
    private static final String VAR_LOAN_ID = "loanId";
    private static final String VAR_APPLICATION_NUMBER = "applicationNumber";
    private static final String VAR_LOAN_AMOUNT = "loanAmount";
    private static final String VAR_APPROVED = "approved";

    public CamundaTaskController(TaskService taskService, RuntimeService runtimeService) {
        this.taskService = taskService;
        this.runtimeService = runtimeService;
    }

    // 🔹 Get verification tasks
    @GetMapping("/verification")
    public List<Map<String, Object>> getVerificationTasks() {
        List<Task> tasks = taskService.createTaskQuery()
                .taskCandidateGroup("verification")
                .list();

        return tasks.stream().map(t -> {
            Map<String, Object> map = new HashMap<>();
            map.put(VAR_TASK_ID, t.getId());
            map.put(VAR_TASK_NAME, t.getName());
            map.put(VAR_CREATED, t.getCreateTime());
            map.put(VAR_LOAN_TYPE, runtimeService.getVariable(t.getExecutionId(), VAR_LOAN_TYPE));
            map.put(VAR_LOAN_ID, runtimeService.getVariable(t.getExecutionId(), VAR_LOAN_ID));
            map.put(VAR_APPLICATION_NUMBER, runtimeService.getVariable(t.getExecutionId(), VAR_APPLICATION_NUMBER));
            map.put(VAR_LOAN_AMOUNT, runtimeService.getVariable(t.getExecutionId(), VAR_LOAN_AMOUNT));
            return map;
        }).toList(); // ✅ Java 16+ replacement
    }

    // 🔹 Get manager approval tasks
    @GetMapping("/manager")
    public List<Map<String, Object>> getManagerTasks() {
        List<Task> tasks = taskService.createTaskQuery()
                .taskCandidateGroup("manager")
                .list();

        return tasks.stream().map(t -> {
            Map<String, Object> map = new HashMap<>();
            map.put(VAR_TASK_ID, t.getId());
            map.put(VAR_TASK_NAME, t.getName());
            map.put(VAR_CREATED, t.getCreateTime());
            map.put(VAR_LOAN_ID, runtimeService.getVariable(t.getExecutionId(), VAR_LOAN_ID));
            map.put(VAR_APPLICATION_NUMBER, runtimeService.getVariable(t.getExecutionId(), VAR_APPLICATION_NUMBER));
            map.put(VAR_LOAN_AMOUNT, runtimeService.getVariable(t.getExecutionId(), VAR_LOAN_AMOUNT));
            return map;
        }).toList(); // ✅ Java 16+ replacement
    }

    // 🔹 Complete a task (works for both manager & verification)
    @PostMapping("/complete/{taskId}")
    public String completeTask(@PathVariable String taskId, @RequestBody Map<String, Object> body) {
        boolean approved = body != null && body.get(VAR_APPROVED) != null
                && Boolean.parseBoolean(body.get(VAR_APPROVED).toString());

        Map<String, Object> vars = new HashMap<>();
        vars.put(VAR_APPROVED, approved);

        taskService.complete(taskId, vars);

        return approved ? "✅ Task approved!" : "❌ Task rejected!";
    }
}
