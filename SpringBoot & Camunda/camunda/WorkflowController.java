package com.example.loan_management_system.camunda;

import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.task.Task;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/workflow")
public class WorkflowController {

    private final TaskService taskService;

    // ✅ Constructor injection instead of field injection
    public WorkflowController(TaskService taskService) {
        this.taskService = taskService;
    }

    // ✅ Get all pending tasks
    @GetMapping("/tasks")
    public List<Map<String, Object>> getAllTasks() {
        List<Task> tasks = taskService.createTaskQuery().list();
        List<Map<String, Object>> response = new ArrayList<>();

        for (Task task : tasks) {
            Map<String, Object> taskData = new HashMap<>();
            taskData.put("id", task.getId());
            taskData.put("name", task.getName());
            taskData.put("assignee", task.getAssignee());
            taskData.put("processInstanceId", task.getProcessInstanceId());
            response.add(taskData);
        }
        return response;
    }

    // ✅ Complete a task with optional variables
    @PostMapping("/complete-task/{taskId}")
    public String completeTask(@PathVariable String taskId,
                               @RequestBody(required = false) Map<String, Object> variables) {
        try {
            if (variables == null) {
                variables = new HashMap<>();
            }
            taskService.complete(taskId, variables);
            return "Task " + taskId + " completed successfully!";
        } catch (Exception e) {
            return "Error completing task: " + e.getMessage();
        }
    }
}
