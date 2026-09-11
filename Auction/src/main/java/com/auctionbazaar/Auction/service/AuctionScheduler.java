package com.auctionbazaar.Auction.service;

import com.auctionbazaar.Auction.model.Auction;
import com.auctionbazaar.Auction.model.AuctionStatus;
import com.auctionbazaar.Auction.model.Bid;
import com.auctionbazaar.Auction.model.User;
import com.auctionbazaar.Auction.repository.AuctionRepository;
import com.auctionbazaar.Auction.repository.BidRepository;
import com.auctionbazaar.Auction.repository.UserRepository;
import jakarta.transaction.Transactional;
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
    @Transactional
    public void processEndedAuctions() {
        // Find all auctions where end date has passed and emails haven't been sent yet
        List<Auction> allAuctions = auctionRepository.findAll();
        Date now = new Date();

        for (Auction auction : allAuctions) {
            // Skip auctions already completed or closed
            boolean alreadyDone = auction.getStatus() == AuctionStatus.COMPLETED
                               || auction.getStatus() == AuctionStatus.CLOSED;
            if (auction.getEndDateTime() != null
                    && auction.getEndDateTime().before(now)
                    && !auction.isEndEmailsSent()
                    && !alreadyDone) {
                try {
                    System.out.println("[Scheduler] Auction " + auction.getId() + " has ended. Processing emails...");
                    sendEndOfAuctionEmails(auction);
                    auction.setEndEmailsSent(true);
                    auction.setStatus(AuctionStatus.COMPLETED);
                    auctionRepository.save(auction);
                    System.out.println("[Scheduler] Auction " + auction.getId() + " marked as COMPLETED and emails sent.");
                } catch (Exception e) {
                    System.err.println("[Scheduler] ❌ Failed to process end-of-auction for auction ID: "
                            + auction.getId() + " - " + e.getMessage());
                    e.printStackTrace();
                }
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // HTML Email Wrapper — shared branded shell used by all templates
    // ─────────────────────────────────────────────────────────────────────────
    private String wrapInEmailTemplate(String accentColor, String headerIcon, String headerTitle, String bodyContent) {
        return "<!DOCTYPE html>" +
               "<html lang='en'><head><meta charset='UTF-8'/>" +
               "<meta name='viewport' content='width=device-width, initial-scale=1.0'/>" +
               "<title>" + headerTitle + "</title></head>" +
               "<body style='margin:0;padding:0;background:#f0f4f8;font-family:Arial,Helvetica,sans-serif;'>" +
               "<table width='100%' cellpadding='0' cellspacing='0' style='background:#f0f4f8;padding:32px 0;'><tr><td align='center'>" +
               "<table width='600' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);max-width:600px;width:100%;'>" +
               // Header
               "<tr><td style='background:linear-gradient(135deg," + accentColor + ");padding:36px 40px;text-align:center;'>" +
               "<div style='font-size:48px;margin-bottom:12px;'>" + headerIcon + "</div>" +
               "<h1 style='color:#ffffff;margin:0;font-size:24px;font-weight:700;letter-spacing:0.5px;'>" + headerTitle + "</h1>" +
               "<p style='color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;'>AuctionBazaar Platform</p>" +
               "</td></tr>" +
               // Body
               "<tr><td style='padding:36px 40px;'>" +
               bodyContent +
               "</td></tr>" +
               // Footer
               "<tr><td style='background:#f8fafc;border-top:1px solid #e8ecf0;padding:24px 40px;text-align:center;'>" +
               "<p style='color:#94a3b8;font-size:12px;margin:0;'>© 2024 AuctionBazaar. All rights reserved.</p>" +
               "<p style='color:#94a3b8;font-size:12px;margin:6px 0 0;'>This is an automated notification. Please do not reply to this email.</p>" +
               "</td></tr>" +
               "</table>" +
               "</td></tr></table>" +
               "</body></html>";
    }

    private String infoRow(String label, String value) {
        return "<tr>" +
               "<td style='padding:10px 16px;font-size:14px;color:#64748b;font-weight:600;background:#f8fafc;border-radius:6px 0 0 6px;white-space:nowrap;'>" + label + "</td>" +
               "<td style='padding:10px 16px;font-size:14px;color:#1e293b;font-weight:500;'>" + value + "</td>" +
               "</tr>";
    }

    private void sendEndOfAuctionEmails(Auction auction) {
        System.out.println("[Scheduler] Processing end-of-auction emails for auction ID: " + auction.getId());

        List<Bid> bids = bidRepository.findByAuctionId(auction.getId());
        System.out.println("[Scheduler] Found " + bids.size() + " bid(s) for auction ID: " + auction.getId());

        // ── Find the highest bid ──────────────────────────────────────────────
        Bid highestBid = null;
        for (Bid bid : bids) {
            if (highestBid == null || bid.getAmount() > highestBid.getAmount()) {
                highestBid = bid;
            }
        }

        // ── Resolve auction owner name for personalization ────────────────────
        String ownerName = "Seller";
        if (auction.getOwnerId() != null) {
            Optional<User> ownerOpt = userRepository.findById(auction.getOwnerId());
            if (ownerOpt.isPresent()) {
                ownerName = ownerOpt.get().getFirstName();
            }
        }
        String creatorEmail = auction.getCreatedBy();

        // ── Common auction info ────────────────────────────────────────────────
        String auctionInfoTable =
                "<table cellpadding='0' cellspacing='0' style='width:100%;border-collapse:separate;border-spacing:0 6px;margin:24px 0;'>" +
                infoRow("📦 Auction", auction.getTitle()) +
                infoRow("🆔 Auction ID", "#" + auction.getId()) +
                "</table>";

        // ═════════════════════════════════════════════════════════════════════
        //  CASE A — There are bids: notify Owner, Winner, and Admins
        // ═════════════════════════════════════════════════════════════════════
        if (highestBid != null) {

            String winningAmount = String.format("$%.2f", highestBid.getAmount());

            // ── 1. Notify Auction Owner ──────────────────────────────────────
            if (creatorEmail != null) {
                String ownerBody =
                        "<p style='color:#1e293b;font-size:16px;margin:0 0 16px;'>Hi <strong>" + ownerName + "</strong>,</p>" +
                        "<p style='color:#475569;font-size:15px;line-height:1.6;margin:0 0 20px;'>" +
                        "Great news! Your auction has successfully concluded with a winning bid. " +
                        "Here's a summary of the result:</p>" +
                        auctionInfoTable.replace("</table>",
                            infoRow("💰 Winning Bid", winningAmount) +
                            "</table>") +
                        "<div style='background:linear-gradient(135deg,#10b981,#059669);border-radius:12px;padding:20px 24px;margin:24px 0;'>" +
                        "<p style='color:#ffffff;font-size:22px;font-weight:700;margin:0;text-align:center;'>Sold for " + winningAmount + "! 🎉</p>" +
                        "</div>" +
                        "<p style='color:#475569;font-size:14px;line-height:1.6;'>Please log in to your dashboard to view the winner's details and arrange shipping and payment.</p>";

                String ownerHtml = wrapInEmailTemplate(
                        "#10b981,#059669",
                        "🏆",
                        "Your Auction Sold Successfully!",
                        ownerBody
                );
                emailService.sendEmail(creatorEmail, "🏆 Auction Sold! — " + auction.getTitle(), ownerHtml);
                System.out.println("[Scheduler] ✅ Owner notified: " + creatorEmail);
            }

            // ── 2. Notify Winner ─────────────────────────────────────────────
            Optional<User> winnerOpt = userRepository.findById(highestBid.getUserId());
            String winnerEmail = null;
            String winnerName  = "Bidder";
            if (winnerOpt.isPresent()) {
                User winner = winnerOpt.get();
                winnerEmail = winner.getEmail();
                winnerName  = winner.getFirstName();

                String winnerBody =
                        "<p style='color:#1e293b;font-size:16px;margin:0 0 16px;'>Hi <strong>" + winnerName + "</strong>,</p>" +
                        "<p style='color:#475569;font-size:15px;line-height:1.6;margin:0 0 20px;'>" +
                        "You placed the highest bid and <strong>won the auction</strong>! 🎊 Here are your auction details:</p>" +
                        auctionInfoTable.replace("</table>",
                            infoRow("💰 Your Winning Bid", winningAmount) +
                            "</table>") +
                        "<div style='background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:12px;padding:20px 24px;margin:24px 0;text-align:center;'>" +
                        "<p style='color:#ffffff;font-size:20px;font-weight:700;margin:0;'>🎉 Congratulations, " + winnerName + "!</p>" +
                        "<p style='color:rgba(255,255,255,0.90);font-size:14px;margin:8px 0 0;'>You won with a bid of " + winningAmount + "</p>" +
                        "</div>" +
                        "<p style='color:#475569;font-size:14px;line-height:1.6;'>Please log in to your dashboard to complete the purchase. The seller will contact you shortly with shipping and payment instructions.</p>";

                String winnerHtml = wrapInEmailTemplate(
                        "#f59e0b,#d97706",
                        "🥇",
                        "You Won the Auction!",
                        winnerBody
                );
                emailService.sendEmail(winnerEmail, "🥇 You Won! — " + auction.getTitle(), winnerHtml);
                System.out.println("[Scheduler] ✅ Winner notified: " + winnerEmail);
            } else {
                System.out.println("[Scheduler] ⚠️ Winner user not found for userId: " + highestBid.getUserId());
            }

            // ── 3. Notify All Admins — always fires regardless of winner lookup ──
            try {
                List<User> admins = userRepository.findByRole(com.auctionbazaar.Auction.model.Role.ADMIN);
                if (admins.isEmpty()) {
                    System.out.println("[Scheduler] ⚠️ No admin users found to notify.");
                }
                String resolvedWinnerEmail = (winnerEmail != null) ? winnerEmail : "User #" + highestBid.getUserId() + " (account not found)";

                String adminBody =
                        "<p style='color:#475569;font-size:15px;line-height:1.6;margin:0 0 20px;'>" +
                        "The following auction has successfully concluded. Here is the full summary for your records:</p>" +
                        auctionInfoTable.replace("</table>",
                            infoRow("💰 Winning Bid", winningAmount) +
                            infoRow("🏷️ Auction Owner", ownerName + (creatorEmail != null ? " (" + creatorEmail + ")" : "")) +
                            infoRow("🥇 Winner", winnerName + " (" + resolvedWinnerEmail + ")") +
                            "</table>") +
                        "<div style='background:#fef3c7;border:1px solid #fcd34d;border-radius:10px;padding:16px 20px;margin:20px 0;'>" +
                        "<p style='color:#92400e;font-size:13px;margin:0;font-weight:600;'>📋 Admin Note</p>" +
                        "<p style='color:#78350f;font-size:13px;margin:8px 0 0;line-height:1.5;'>Both the auction owner and the winner have been notified via email. " +
                        "Please monitor for any payment or shipping disputes.</p>" +
                        "</div>";

                String adminHtml = wrapInEmailTemplate(
                        "#6366f1,#8b5cf6",
                        "📊",
                        "Auction Concluded Successfully",
                        adminBody
                );

                for (User admin : admins) {
                    emailService.sendEmail(admin.getEmail(), "📊 Auction Concluded: " + auction.getTitle(), adminHtml);
                    System.out.println("[Scheduler] ✅ Admin notified: " + admin.getEmail());
                }
            } catch (Exception e) {
                System.err.println("[Scheduler] ❌ Failed to send admin notification: " + e.getMessage());
            }

        // ═════════════════════════════════════════════════════════════════════
        //  CASE B — No bids: notify Owner and Admins
        // ═════════════════════════════════════════════════════════════════════
        } else {

            // ── 1. Notify Auction Owner ──────────────────────────────────────
            if (creatorEmail != null) {
                String ownerBody =
                        "<p style='color:#1e293b;font-size:16px;margin:0 0 16px;'>Hi <strong>" + ownerName + "</strong>,</p>" +
                        "<p style='color:#475569;font-size:15px;line-height:1.6;margin:0 0 20px;'>" +
                        "Your auction has ended, but unfortunately no bids were placed this time. Don't be discouraged — " +
                        "you can relist the item and try again!</p>" +
                        auctionInfoTable +
                        "<div style='background:#fef2f2;border:1px solid #fca5a5;border-radius:10px;padding:16px 20px;margin:24px 0;'>" +
                        "<p style='color:#991b1b;font-size:15px;font-weight:600;margin:0;'>⚠️ No bids received</p>" +
                        "<p style='color:#7f1d1d;font-size:13px;margin:8px 0 0;line-height:1.5;'>Consider adjusting your starting price or extending the auction duration for better results. You can relist the item from your dashboard.</p>" +
                        "</div>";

                String ownerHtml = wrapInEmailTemplate(
                        "#94a3b8,#64748b",
                        "📭",
                        "Your Auction Ended with No Bids",
                        ownerBody
                );
                emailService.sendEmail(creatorEmail, "📭 Auction Ended (No Bids) — " + auction.getTitle(), ownerHtml);
                System.out.println("[Scheduler] ✅ Owner notified (no bids): " + creatorEmail);
            }

            // ── 2. Notify All Admins ─────────────────────────────────────────
            try {
                List<User> admins = userRepository.findByRole(com.auctionbazaar.Auction.model.Role.ADMIN);
                if (admins.isEmpty()) {
                    System.out.println("[Scheduler] ⚠️ No admin users found to notify.");
                }

                String adminBody =
                        "<p style='color:#475569;font-size:15px;line-height:1.6;margin:0 0 20px;'>" +
                        "The following auction has ended without receiving any bids. The seller has been notified.</p>" +
                        auctionInfoTable.replace("</table>",
                            infoRow("📭 Result", "No Bids") +
                            infoRow("🏷️ Auction Owner", ownerName + (creatorEmail != null ? " (" + creatorEmail + ")" : "")) +
                            "</table>") +
                        "<div style='background:#fef3c7;border:1px solid #fcd34d;border-radius:10px;padding:16px 20px;margin:20px 0;'>" +
                        "<p style='color:#92400e;font-size:13px;margin:0;font-weight:600;'>📋 Admin Note</p>" +
                        "<p style='color:#78350f;font-size:13px;margin:8px 0 0;line-height:1.5;'>The seller has been notified and encouraged to relist. " +
                        "No further action is required unless the seller contacts support.</p>" +
                        "</div>";

                String adminHtml = wrapInEmailTemplate(
                        "#f97316,#ea580c",
                        "📭",
                        "Auction Ended — No Bids",
                        adminBody
                );

                for (User admin : admins) {
                    emailService.sendEmail(admin.getEmail(), "📭 Auction Ended (No Bids): " + auction.getTitle(), adminHtml);
                    System.out.println("[Scheduler] ✅ Admin notified (no bids): " + admin.getEmail());
                }
            } catch (Exception e) {
                System.err.println("[Scheduler] ❌ Failed to send admin notification (no bids): " + e.getMessage());
            }
        }
    }
}
