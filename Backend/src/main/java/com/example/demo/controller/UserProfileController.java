package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class UserProfileController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<User> getProfile(@RequestParam String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @PutMapping
    public ResponseEntity<User> updateProfile(@RequestParam String email, @RequestBody User updatedUser) {
        return ResponseEntity.ok(userService.updateUserProfile(email, updatedUser));
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/lawyers")
    public ResponseEntity<List<User>> getAllLawyers() {
        return ResponseEntity.ok(userService.getAllLawyers());
    }

    @GetMapping("/lawyers/pending")
    public ResponseEntity<List<User>> getPendingLawyers() {
        List<User> lawyers = userService.getAllLawyers();
        List<User> pendingLawyers = lawyers.stream()
            .filter(lawyer -> "pending".equals(lawyer.getVerificationStatus()))
            .toList();
        return ResponseEntity.ok(pendingLawyers);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        List<User> allUsers = userService.getAllUsers();
        List<User> lawyers = userService.getAllLawyers();
        
        long totalUsers = allUsers.size();
        long totalClients = allUsers.stream()
            .filter(user -> "client".equals(user.getRole()))
            .count();
        long totalLawyers = lawyers.size();
        long pendingVerifications = lawyers.stream()
            .filter(lawyer -> "pending".equals(lawyer.getVerificationStatus()))
            .count();
        long verifiedLawyers = lawyers.stream()
            .filter(lawyer -> "verified".equals(lawyer.getVerificationStatus()))
            .count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalClients", totalClients);
        stats.put("totalLawyers", totalLawyers);
        stats.put("pendingVerifications", pendingVerifications);
        stats.put("verifiedLawyers", verifiedLawyers);
        
        return ResponseEntity.ok(stats);
    }

    @PatchMapping("/verify/{id}")
    public ResponseEntity<User> verifyLawyer(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(userService.updateVerificationStatus(id, status));
    }

}
