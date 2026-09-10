package com.auctionbazaar.Auction.controller;

import com.auctionbazaar.Auction.model.Role;
import com.auctionbazaar.Auction.model.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.auctionbazaar.Auction.model.User;
import com.auctionbazaar.Auction.model.AuctionStatus;
import com.auctionbazaar.Auction.model.Auction;
import com.auctionbazaar.Auction.model.ItemImages;
import com.auctionbazaar.Auction.response.ApiResponse;
import com.auctionbazaar.Auction.service.AuctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController

@RequestMapping("/auctions")
public class AuctionController {

    @Autowired
    private AuctionService auctionService;

    @PostMapping("/{auctionId}/images")
    public ResponseEntity<ApiResponse<ItemImages>> addImageToAuction(
            @PathVariable Long auctionId,
            @RequestParam("file") MultipartFile file) {
        ItemImages itemImage = auctionService.addImageToAuction(auctionId, file);
        ApiResponse<ItemImages> response = new ApiResponse<>(
                "Image added to auction successfully",
                HttpStatus.CREATED.value(),
                itemImage
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/{auctionId}/images")
    public ResponseEntity<ApiResponse<String>> deleteImagesByAuctionId(@PathVariable Long auctionId) {
        auctionService.deleteImagesByAuctionId(auctionId);
        ApiResponse<String> response = new ApiResponse<>(
                "All images deleted successfully for auction " + auctionId,
                HttpStatus.OK.value(),
                null
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping
public ResponseEntity<ApiResponse<Auction>> createAuction(@RequestBody Auction auction,
                                                            @AuthenticationPrincipal User currentUser) {
    auction.setOwnerId(currentUser.getId());
    auction.setCreatedBy(currentUser.getEmail());
    auction.setStatus(AuctionStatus.PENDING);

    Auction createdAuction = auctionService.createAuction(auction);
    ApiResponse<Auction> response = new ApiResponse<>(
            "Auction created successfully by " + auction.getCreatedBy(),
            HttpStatus.CREATED.value(),
            createdAuction
    );
    return new ResponseEntity<>(response, HttpStatus.CREATED);
}

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Auction>> getAuctionById(@PathVariable Long id) {
        Auction auction = auctionService.getAuctionById(id);
        ApiResponse<Auction> response = new ApiResponse<>(
                "Auction retrieved successfully",
                HttpStatus.OK.value(),
                auction
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Auction>>> getAllAuctions() {
        List<Auction> auctions = auctionService.getAllAuctions();
        ApiResponse<List<Auction>> response = new ApiResponse<>(
                "All auctions retrieved successfully",
                HttpStatus.OK.value(),
                auctions
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{createdBy}")
    public ResponseEntity<ApiResponse<List<Auction>>> getAuctionsByUser(@PathVariable String createdBy) {
        // Decode the createdBy parameter to handle spaces (e.g., "John%20Doe" -> "John Doe")
        String decodedCreatedBy = URLDecoder.decode(createdBy, StandardCharsets.UTF_8);

        // Fetch auctions for the user
        List<Auction> auctions = auctionService.getAuctionsByUser(decodedCreatedBy);

        // Prepare the response
        ApiResponse<List<Auction>> response = new ApiResponse<>(
                "Auctions retrieved successfully for user " + decodedCreatedBy,
                HttpStatus.OK.value(),
                auctions
        );
        return ResponseEntity.ok(response);
    }
    @GetMapping("/{auctionId}/images")
    public ResponseEntity<ApiResponse<List<ItemImages>>> getImagesByAuctionId(@PathVariable Long auctionId) {
        List<ItemImages> images = auctionService.getImagesByAuctionId(auctionId);
        ApiResponse<List<ItemImages>> response = new ApiResponse<>(
                "Images retrieved successfully for auction " + auctionId,
                HttpStatus.OK.value(),
                images
        );
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<String>> deleteAuctionsByUser(@PathVariable String userId) {
        // Decode the userId parameter to handle spaces (e.g., "John%20Doe" -> "John Doe")
        String decodedUserId = URLDecoder.decode(userId, StandardCharsets.UTF_8);

        // Delete auctions for the user
        auctionService.deleteAuctionsByUser(decodedUserId);

        // Prepare the response
        ApiResponse<String> response = new ApiResponse<>(
                "All auctions deleted successfully for user " + decodedUserId,
                HttpStatus.OK.value(),
                null
        );
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
public ResponseEntity<ApiResponse<Auction>> updateAuction(@PathVariable Long id,
                                                            @RequestBody Auction auctionDetails,
                                                            @AuthenticationPrincipal User currentUser) {
    Auction existing = auctionService.getAuctionById(id);
    boolean isOwner = existing.getOwnerId() != null && existing.getOwnerId().equals(currentUser.getId());
    boolean isAdmin = currentUser.getRole() == Role.ADMIN;

    if (!isOwner && !isAdmin) {
        return new ResponseEntity<>(
            new ApiResponse<>("You do not have permission to edit this auction", HttpStatus.FORBIDDEN.value(), null),
            HttpStatus.FORBIDDEN
        );
    }

    auctionDetails.setModifiedBy(currentUser.getEmail());
    Auction updatedAuction = auctionService.updateAuction(id, auctionDetails);
    ApiResponse<Auction> response = new ApiResponse<>(
            "Auction updated successfully by " + currentUser.getEmail(),
            HttpStatus.OK.value(),
            updatedAuction
    );
    return ResponseEntity.ok(response);
}

@DeleteMapping("/{id}")
public ResponseEntity<ApiResponse<String>> deleteAuction(@PathVariable Long id,
                                                           @AuthenticationPrincipal User currentUser) {
    Auction existing = auctionService.getAuctionById(id);
    boolean isOwner = existing.getOwnerId() != null && existing.getOwnerId().equals(currentUser.getId());
    boolean isAdmin = currentUser.getRole() == Role.ADMIN;

    if (!isOwner && !isAdmin) {
        return new ResponseEntity<>(
            new ApiResponse<>("You do not have permission to delete this auction", HttpStatus.FORBIDDEN.value(), null),
            HttpStatus.FORBIDDEN
        );
    }

    auctionService.deleteAuction(id);
    ApiResponse<String> response = new ApiResponse<>("Auction deleted successfully", HttpStatus.OK.value(), null);
    return ResponseEntity.ok(response);
}
}