package com.example.loan_management_system.controller;

import com.example.loan_management_system.entity.User;
import com.example.loan_management_system.repository.UserRepository;
import com.example.loan_management_system.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    // ✅ Signup
    @PostMapping("/signup")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    // ✅ Login
    @PostMapping("/login")
    public User login(@RequestBody User user) {
        Optional<User> loggedInUser = userService.loginUser(user.getEmail(), user.getPassword());
        return loggedInUser.orElseThrow(() -> new RuntimeException("Invalid credentials"));
    }

    // ✅ Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ Update user role
    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String role = body.get("role");
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(role);
        return ResponseEntity.ok(userRepository.save(user));
    }
}
