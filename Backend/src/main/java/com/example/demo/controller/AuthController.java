package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // You can specify a domain like "http://localhost:3000"
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User createdUser = userService.registerUser(user);
            return ResponseEntity.ok(Map.of("message", "User registered successfully", "user", createdUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        return userService.login(email, password)
            .map(user -> ResponseEntity.ok(Map.of("message", "Login successful", "user", user)))
            .orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
    }

     // --- NEW ENDPOINT FOR FORGOT PASSWORD ---
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String newPassword = payload.get("newPassword");

        if (email == null || newPassword == null || email.trim().isEmpty() || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and new password must be provided."));
        }

        boolean isUpdated = userService.updatePassword(email, newPassword);

        if (isUpdated) {
            return ResponseEntity.ok(Map.of("message", "Password updated successfully. You can now login."));
        } else {
            return ResponseEntity.status(404).body(Map.of("error", "User with this email does not exist."));
        }
    }
}
