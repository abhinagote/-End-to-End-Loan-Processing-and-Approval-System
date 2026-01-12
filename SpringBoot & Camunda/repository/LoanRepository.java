package com.example.loan_management_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.loan_management_system.entity.Loan;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {

    // ✅ Check if a loan exists by application number
    boolean existsByApplicationNumber(String applicationNumber);

    // ✅ Get loans by user
    List<Loan> findByUserId(Long userId);

    // ✅ Fetch a loan by application number
    Optional<Loan> findByApplicationNumber(String applicationNumber);

    // ✅ (Optional) Delete by application number if needed
    void deleteByApplicationNumber(String applicationNumber);
}
