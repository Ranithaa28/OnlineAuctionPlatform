package com.auctionbazaar.Auction.service;

import com.auctionbazaar.Auction.model.Bid;
import com.auctionbazaar.Auction.model.User;
import com.auctionbazaar.Auction.model.Auction;
import com.auctionbazaar.Auction.repository.BidRepository;
import com.auctionbazaar.Auction.repository.UserRepository;
import com.auctionbazaar.Auction.repository.AuctionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class BidServiceImpl implements BidService {

    @Autowired private BidRepository bidRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private AuctionRepository auctionRepository;
    @Autowired private EmailService emailService;

    @Override
    public Bid createBid(Bid bid) {
        Auction auction = auctionRepository.findById(bid.getAuctionId())
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        // prevent bidding on your own auction
        if (auction.getOwnerId() != null && auction.getOwnerId().equals(bid.getUserId())) {
            throw new RuntimeException("You cannot bid on your own auction");
        }

        if (auction.getEndDateTime() != null && new Date().after(auction.getEndDateTime())) {
            throw new RuntimeException("Auction has already ended");
        }
        
        // validate bid is higher than current highest bid (or base price if no bids yet)
        List<Bid> existingBids = bidRepository.findByAuctionId(bid.getAuctionId());
        double currentHighest = existingBids.stream()
                .mapToDouble(Bid::getAmount)
                .max()
                .orElse(auction.getBasePrice());

        if (bid.getAmount() <= currentHighest) {
            throw new RuntimeException("Bid amount must be higher than the current highest bid ($" + currentHighest + ")");
        }

        bid.setCreatedAt(new Date());
        Bid savedBid = bidRepository.save(bid);

        // Notify bidder + auction owner asynchronously to prevent timeouts
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                User bidder = userRepository.findById(bid.getUserId())
                        .orElseThrow(() -> new RuntimeException("Bidder not found"));

                String ownerEmail = auction.getCreatedBy(); // this is already the owner's email
                if (ownerEmail != null) {
                    String ownerHtml = "<h3>New Bid on Your Auction!</h3>" +
                                       "<p>Good news! A new bid of <strong>$" + bid.getAmount() + "</strong> has been placed on your auction: <strong>" + auction.getTitle() + "</strong> (ID: " + bid.getAuctionId() + ").</p>" +
                                       "<p>Log in to your Dashboard to view the latest bids.</p>";
                    emailService.sendEmail(
                            ownerEmail,
                            "New Bid Received - " + auction.getTitle(),
                            ownerHtml
                    );
                }

                String bidderHtml = "<h3>Bid Placement Receipt</h3>" +
                                    "<p>Hi " + bidder.getFirstName() + ",</p>" +
                                    "<p>Thank you for placing a bid of <strong>$" + bid.getAmount() + "</strong> on auction: <strong>" + auction.getTitle() + "</strong> (ID: " + bid.getAuctionId() + ").</p>" +
                                    "<p>You are currently the highest bidder! We will notify you if you are outbid or if you win the auction.</p>";
                emailService.sendEmail(
                        bidder.getEmail(),
                        "Bid Confirmation - " + auction.getTitle(),
                        bidderHtml
                );
            } catch (Exception e) {
                System.out.println("Email notification failed (non-fatal): " + e.getMessage());
            }
        });

        return savedBid;
    }

    @Override
    public List<Bid> getBidsByAuctionId(Long auctionId) {
        return bidRepository.findByAuctionId(auctionId);
    }

    @Override
    @Transactional
    public int deleteBidsByAuctionId(Long auctionId) {
        return bidRepository.deleteByAuctionId(auctionId);
    }

    @Override
    @Transactional
    public int deleteBidsByUserId(Long userId) {
        return bidRepository.deleteByUserId(userId);
    }
}