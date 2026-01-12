package com.example.loan_management_system.entity;

public class LoanStatusResponse {
    private Long id;
    private String applicationNumber;
    private Double loanAmount;
    private String city;
    private String workflowStatus; // <-- this will store current task name

    public LoanStatusResponse(Long id, String applicationNumber, Double loanAmount, String city, String workflowStatus) {
        this.id = id;
        this.applicationNumber = applicationNumber;
        this.loanAmount = loanAmount;
        this.city = city;
        this.workflowStatus = workflowStatus;
    }

    // Getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getApplicationNumber() { return applicationNumber; }
    public void setApplicationNumber(String applicationNumber) { this.applicationNumber = applicationNumber; }

    public Double getLoanAmount() { return loanAmount; }
    public void setLoanAmount(Double loanAmount) { this.loanAmount = loanAmount; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getWorkflowStatus() { return workflowStatus; }
    public void setWorkflowStatus(String workflowStatus) { this.workflowStatus = workflowStatus; }
}
