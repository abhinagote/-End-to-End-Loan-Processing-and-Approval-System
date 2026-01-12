package com.example.loan_management_system.service;

import com.example.loan_management_system.entity.Loan;
import com.example.loan_management_system.entity.LoanDocument;
import com.example.loan_management_system.repository.LoanRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Random;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final Random random = new Random();

    public LoanService(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    public Loan saveLoan(Loan loan) {
        loan.setSubmitted(false);
        return loanRepository.save(loan);
    }

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public List<Loan> getLoansByUser(Long userId) {
        return loanRepository.findByUserId(userId);
    }

    public Loan submitLoan(Loan loan) {
        String cityPrefix = (loan.getCity() != null && loan.getCity().length() >= 3)
                ? loan.getCity().substring(0, 3).toUpperCase()
                : "XXX";

        String appNumber;
        do {
            appNumber = cityPrefix + String.format("%07d", random.nextInt(10_000_000));
        } while (loanRepository.existsByApplicationNumber(appNumber));

        loan.setApplicationNumber(appNumber);
        loan.setSubmitted(true);
        return loanRepository.save(loan);
    }

    public Loan updateLoan(Long id, Loan updatedLoan) {
        Loan existing = loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        updatedLoan.setId(existing.getId());
        updatedLoan.setUserId(existing.getUserId()); // keep same user
        return loanRepository.save(updatedLoan);
    }

    public void deleteLoan(Long id) {
        if (!loanRepository.existsById(id)) {
            throw new RuntimeException("Loan not found");
        }
        loanRepository.deleteById(id);
    }



    public Loan getLoanById(Long id) {
        return loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found with id: " + id));
    }
}
