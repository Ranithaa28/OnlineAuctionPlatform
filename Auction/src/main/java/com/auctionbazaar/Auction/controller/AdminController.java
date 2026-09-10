package com.auctionbazaar.Auction.controller;

import com.auctionbazaar.Auction.model.*;
import com.auctionbazaar.Auction.repository.AuctionRepository;
import com.auctionbazaar.Auction.repository.UserRepository;
import com.auctionbazaar.Auction.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired private UserRepository userRepository;
    @Autowired private AuctionRepository auctionRepository;
    @Autowired private EmailService emailService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}/disable")
    public ResponseEntity<?> disableUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(false);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User disabled"));
    }

    @PutMapping("/users/{id}/enable")
    public ResponseEntity<?> enableUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(true);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User enabled"));
    }

    @PutMapping("/users/{id}/promote")
    public ResponseEntity<?> promoteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(Role.ADMIN);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User promoted to ADMIN"));
    }

    @GetMapping("/auctions/pending")
    public ResponseEntity<List<Auction>> getPendingAuctions() {
        return ResponseEntity.ok(auctionRepository.findByStatus(AuctionStatus.PENDING));
    }

    @GetMapping("/auctions")
    public ResponseEntity<List<Auction>> getAllAuctions() {
        return ResponseEntity.ok(auctionRepository.findAll());
    }

    @PutMapping("/auctions/{id}/approve")
    public ResponseEntity<?> approveAuction(@PathVariable Long id) {
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Auction not found"));
        auction.setStatus(AuctionStatus.APPROVED);
        auctionRepository.save(auction);
        return ResponseEntity.ok(Map.of("message", "Auction approved"));
    }

    @PutMapping("/auctions/{id}/reject")
    public ResponseEntity<?> rejectAuction(@PathVariable Long id) {
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Auction not found"));
        auction.setStatus(AuctionStatus.REJECTED);
        auctionRepository.save(auction);
        return ResponseEntity.ok(Map.of("message", "Auction rejected"));
    }

    @DeleteMapping("/auctions/{id}")
    public ResponseEntity<?> deleteAuction(@PathVariable Long id) {
        auctionRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Auction deleted"));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    @PostMapping("/test-email")
    public ResponseEntity<?> testEmail(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email address is required"));
        }
        try {
            emailService.sendEmail(email, "System Test - Auction Bazaar", "<h1>SMTP Connection Successful!</h1><p>The email triggering system is fully functional.</p>");
            return ResponseEntity.ok(Map.of("message", "Test email sent successfully. Check your inbox!"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Email failed: " + e.getMessage()));
        }
    }
}