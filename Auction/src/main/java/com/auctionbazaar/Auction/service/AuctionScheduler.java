package com.auctionbazaar.Auction.service;

import com.auctionbazaar.Auction.model.Auction;
import com.auctionbazaar.Auction.model.Bid;
import com.auctionbazaar.Auction.model.User;
import com.auctionbazaar.Auction.repository.AuctionRepository;
import com.auctionbazaar.Auction.repository.BidRepository;
import com.auctionbazaar.Auction.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class AuctionScheduler {

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // Run every minute
    @Scheduled(fixedRate = 60000)
    public void processEndedAuctions() {
        // Find all auctions where end date has passed and emails haven't been sent yet
        List<Auction> allAuctions = auctionRepository.findAll();
        Date now = new Date();

        for (Auction auction : allAuctions) {
            if (auction.getEndDateTime() != null && auction.getEndDateTime().before(now) && !auction.isEndEmailsSent()) {
                sendEndOfAuctionEmails(auction);
                auction.setEndEmailsSent(true);
                auctionRepository.save(auction);
            }
        }
    }

    private void sendEndOfAuctionEmails(Auction auction) {
        System.out.println("Processing end of auction emails for auction ID: " + auction.getId());
        List<Bid> bids = bidRepository.findByAuctionId(auction.getId());
        
        Bid highestBid = null;
        for (Bid bid : bids) {
            if (highestBid == null || bid.getAmount() > highestBid.getAmount()) {
                highestBid = bid;
            }
        }

        String creatorEmail = auction.getCreatedBy();

        if (highestBid != null) {
            // Notify Creator
            if (creatorEmail != null) {
                String creatorHtml = "<h3>Your Auction has Successfully Concluded!</h3>" +
                        "<p>Congratulations! Your auction <strong>" + auction.getTitle() + "</strong> (ID: " + auction.getId() + ") has ended.</p>" +
                        "<p>The final winning bid was <strong>$" + highestBid.getAmount() + "</strong>.</p>" +
                        "<p>Please contact the winner to arrange shipping and payment.</p>";
                emailService.sendEmail(creatorEmail, "Auction Sold! - " + auction.getTitle(), creatorHtml);
            }

            // Notify Winner
            Optional<User> winnerOpt = userRepository.findById(highestBid.getUserId());
            if (winnerOpt.isPresent()) {
                User winner = winnerOpt.get();
                String winnerHtml = "<h3>Congratulations! You won the auction!</h3>" +
                        "<p>Hi " + winner.getFirstName() + ",</p>" +
                        "<p>You are the winning bidder for <strong>" + auction.getTitle() + "</strong> (ID: " + auction.getId() + ").</p>" +
                        "<p>Your winning bid amount was <strong>$" + highestBid.getAmount() + "</strong>.</p>" +
                        "<p>Please log in to your dashboard to complete the process.</p>";
                emailService.sendEmail(winner.getEmail(), "You Won the Auction! - " + auction.getTitle(), winnerHtml);
                
                // Notify Admins
                try {
                    List<User> admins = userRepository.findByRole(com.auctionbazaar.Auction.model.Role.ADMIN);
                    String adminHtml = "<h3>Auction Concluded Successfully</h3>" +
                                       "<p>The auction <strong>" + auction.getTitle() + "</strong> (ID: " + auction.getId() + ") has officially ended.</p>" +
                                       "<p><strong>Winner Email:</strong> " + winner.getEmail() + "</p>" +
                                       "<p><strong>Winning Bid:</strong> $" + highestBid.getAmount() + "</p>";
                    for (User admin : admins) {
                        emailService.sendEmail(admin.getEmail(), "Auction Concluded: " + auction.getTitle(), adminHtml);
                    }
                } catch (Exception e) {
                    System.out.println("Failed to send admin notification for auction end: " + e.getMessage());
                }
            }
        } else {
            // No bids
            if (creatorEmail != null) {
                String creatorHtml = "<h3>Your Auction has Ended</h3>" +
                        "<p>Your auction <strong>" + auction.getTitle() + "</strong> (ID: " + auction.getId() + ") has ended with no bids.</p>" +
                        "<p>You can choose to relist the item from your dashboard.</p>";
                emailService.sendEmail(creatorEmail, "Auction Ended (No Bids) - " + auction.getTitle(), creatorHtml);
            }
            
            // Notify Admins
            try {
                List<User> admins = userRepository.findByRole(com.auctionbazaar.Auction.model.Role.ADMIN);
                String adminHtml = "<h3>Auction Concluded Unsuccessfully</h3>" +
                                   "<p>The auction <strong>" + auction.getTitle() + "</strong> (ID: " + auction.getId() + ") has ended with zero bids.</p>";
                for (User admin : admins) {
                    emailService.sendEmail(admin.getEmail(), "Auction Ended (No Bids): " + auction.getTitle(), adminHtml);
                }
            } catch (Exception e) {
                System.out.println("Failed to send admin notification for auction end (no bids): " + e.getMessage());
            }
        }
    }
}
