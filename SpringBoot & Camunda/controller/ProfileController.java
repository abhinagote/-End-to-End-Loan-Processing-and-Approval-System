package com.example.loan_management_system.controller;

import com.example.loan_management_system.entity.User;
import com.example.loan_management_system.entity.Loan;
import com.example.loan_management_system.repository.UserRepository;
import com.example.loan_management_system.repository.LoanRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    private final UserRepository userRepository;
    private final LoanRepository loanRepository;

    // ✅ Constructor injection (preferred over field injection)
    public ProfileController(UserRepository userRepository, LoanRepository loanRepository) {
        this.userRepository = userRepository;
        this.loanRepository = loanRepository;
    }

    // ✅ Get user details by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getProfile(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Get all loans of a specific user
    @GetMapping("/{id}/loans")
    public ResponseEntity<List<Loan>> getUserLoans(@PathVariable Long id) {
        List<Loan> loans = loanRepository.findByUserId(id);
        return ResponseEntity.ok(loans);
    }
}
