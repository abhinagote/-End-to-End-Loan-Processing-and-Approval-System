package com.example.loan_management_system.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "loan_documents")
public class LoanDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "loan_doc_seq")
    @SequenceGenerator(name = "loan_doc_seq", sequenceName = "loan_doc_seq", allocationSize = 1)
    private Long id;

    private String fileName;

    @Lob
    @Column(name = "content", columnDefinition = "BLOB")  // ✅ Explicit BLOB column for Oracle
    private byte[] content;

    @ManyToOne
    @JoinColumn(name = "loan_id", nullable = false)  // ✅ Ensure FK is not null
    private Loan loan;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public byte[] getContent() { return content; }
    public void setContent(byte[] content) { this.content = content; }

    public Loan getLoan() { return loan; }
    public void setLoan(Loan loan) { this.loan = loan; }
}
