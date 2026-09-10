package com.auctionbazaar.Auction.controller;

import com.auctionbazaar.Auction.model.Bid;
import com.auctionbazaar.Auction.model.Role;
import com.auctionbazaar.Auction.model.User;
import com.auctionbazaar.Auction.response.ApiResponse;
import com.auctionbazaar.Auction.service.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/bids")
public class BidController {

    @Autowired
    private BidService bidService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping
    public ResponseEntity<ApiResponse<Bid>> createBid(@RequestBody Bid bid,
                                                        @AuthenticationPrincipal User currentUser) {
        bid.setUserId(currentUser.getId());
        bid.setCreatedBy(currentUser.getEmail());

        Bid createdBid = bidService.createBid(bid);
        
        // Broadcast the new bid to WebSocket subscribers
        messagingTemplate.convertAndSend("/topic/auctions/" + createdBid.getAuctionId() + "/bids", createdBid);
        
        ApiResponse<Bid> response = new ApiResponse<>(
                "Bid created successfully by " + currentUser.getEmail(),
                HttpStatus.CREATED.value(),
                createdBid
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/auction/{auctionId}")
    public ResponseEntity<ApiResponse<List<Bid>>> getBidsByAuctionId(@PathVariable Long auctionId) {
        List<Bid> bids = bidService.getBidsByAuctionId(auctionId);
        ApiResponse<List<Bid>> response = new ApiResponse<>(
                "Bids retrieved successfully for auction ID: " + auctionId,
                HttpStatus.OK.value(),
                bids
        );
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/auction/{auctionId}")
    public ResponseEntity<ApiResponse<Void>> deleteBidsByAuctionId(@PathVariable Long auctionId,
                                                                     @AuthenticationPrincipal User currentUser) {
        if (currentUser.getRole() != Role.ADMIN) {
            return new ResponseEntity<>(
                new ApiResponse<>("Only admins can delete bids for an auction", HttpStatus.FORBIDDEN.value(), null),
                HttpStatus.FORBIDDEN
            );
        }
        int deletedCount = bidService.deleteBidsByAuctionId(auctionId);
        String message = "Deleted " + deletedCount + " bids for auction ID: " + auctionId;
        return ResponseEntity.ok(new ApiResponse<>(message, HttpStatus.OK.value(), null));
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteBidsByUserId(@PathVariable Long userId,
                                                                  @AuthenticationPrincipal User currentUser) {
        if (!userId.equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            return new ResponseEntity<>(
                new ApiResponse<>("You do not have permission to delete these bids", HttpStatus.FORBIDDEN.value(), null),
                HttpStatus.FORBIDDEN
            );
        }
        int deletedCount = bidService.deleteBidsByUserId(userId);
        String message = "Deleted " + deletedCount + " bids for user ID: " + userId;
        return ResponseEntity.ok(new ApiResponse<>(message, HttpStatus.OK.value(), null));
    }
}