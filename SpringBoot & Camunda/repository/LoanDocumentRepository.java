package com.example.loan_management_system.repository;

import com.example.loan_management_system.entity.Loan;
import com.example.loan_management_system.entity.LoanDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanDocumentRepository extends JpaRepository<LoanDocument, Long> {
    List<LoanDocument> findByLoan(Loan loan);
}
