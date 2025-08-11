// UserService.java
package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // Check if email already exists
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        return userRepository.save(user);
    }

    public Optional<User> login(String email, String password) {
        return userRepository.findByEmail(email)
            .filter(user -> user.getPassword().equals(password));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public List<User> getAllLawyers() {
        return userRepository.findByRole("lawyer");
    }

    public List<User> getAllUsers() {
        return userRepository.findAll(); // Adjust as per your repo logic
    }

    public User updateVerificationStatus(Long id, String status) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return null;

        user.setVerificationStatus(status);
        user.setIsVerified("verified".equalsIgnoreCase(status));

        return userRepository.save(user);
    }

    public User updateUserProfile(String email, User updatedData) {
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) {
            User user = existing.get();

            user.setName(updatedData.getName());
            user.setPhone(updatedData.getPhone());

            // Lawyer-specific fields
            user.setBio(updatedData.getBio());
            user.setLocation(updatedData.getLocation());
            user.setConsultationFee(updatedData.getConsultationFee());
            user.setBarCouncilNumber(updatedData.getBarCouncilNumber());
            user.setYearsOfExperience(updatedData.getYearsOfExperience());
            user.setSpecializations(updatedData.getSpecializations());
            user.setLanguages(updatedData.getLanguages());
            user.setEducation(updatedData.getEducation());

            // ✅ New KYC fields
            user.setAadhaarPan(updatedData.getAadhaarPan());
            user.setDriveLink(updatedData.getDriveLink());

            return userRepository.save(user);
        }
        return null;
    }

    public boolean updatePassword(String email, String newPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // IMPORTANT: In production, hash the new password before saving.
            // user.setPassword(passwordEncoder.encode(newPassword));
            user.setPassword(newPassword);
            userRepository.save(user);
            return true;
        }
        return false; // User not found
    }

}
