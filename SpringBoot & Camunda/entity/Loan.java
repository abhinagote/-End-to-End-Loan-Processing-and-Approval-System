package com.example.loan_management_system.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "loans")
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String applicantName;
    private String applicationNumber;
    private String city;
    private boolean submitted;
    private String phone;
    private String email;
    private double loanAmount;
    private String street1;
    private String street2;
    private String street3;
    private String landmark;
    private String state;
    private String country;
    private String pincode;
    private String yearlyIncome;
    private String profession;
    private String dob;
    private String aadhar;
    private String pan;
    private String termInMonths;
    private String startDate;
    private String workflowStage; 
    // 🔹 Link loan with user
    private Long userId;
    private boolean verified; 
    private String loanType; 
    
    public String getLoanType() {
        return loanType;
    }

    public void setLoanType(String loanType) {
        this.loanType = loanType;
    }
    
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
    
    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getApplicantName() { return applicantName; }
    public void setApplicantName(String applicantName) { this.applicantName = applicantName; }

    public String getApplicationNumber() { return applicationNumber; }
    public void setApplicationNumber(String applicationNumber) { this.applicationNumber = applicationNumber; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public boolean isSubmitted() { return submitted; }
    public void setSubmitted(boolean submitted) { this.submitted = submitted; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public double getLoanAmount() { return loanAmount; }
    public void setLoanAmount(double loanAmount) { this.loanAmount = loanAmount; }

    public String getStreet1() { return street1; }
    public void setStreet1(String street1) { this.street1 = street1; }

    public String getStreet2() { return street2; }
    public void setStreet2(String street2) { this.street2 = street2; }

    public String getStreet3() { return street3; }
    public void setStreet3(String street3) { this.street3 = street3; }

    public String getLandmark() { return landmark; }
    public void setLandmark(String landmark) { this.landmark = landmark; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getYearlyIncome() { return yearlyIncome; }
    public void setYearlyIncome(String yearlyIncome) { this.yearlyIncome = yearlyIncome; }

    public String getProfession() { return profession; }
    public void setProfession(String profession) { this.profession = profession; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public String getAadhar() { return aadhar; }
    public void setAadhar(String aadhar) { this.aadhar = aadhar; }

    public String getPan() { return pan; }
    public void setPan(String pan) { this.pan = pan; }

    public String getTermInMonths() { return termInMonths; }
    public void setTermInMonths(String termInMonths) { this.termInMonths = termInMonths; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public String getWorkflowStage() {
        return workflowStage;
    }

    public void setWorkflowStage(String workflowStage) {
        this.workflowStage = workflowStage;
    }
}
	

