package com.auctionbazaar.Auction.service;

import com.auctionbazaar.Auction.exception.AuctionNotFoundException;
import com.auctionbazaar.Auction.model.Auction;
import com.auctionbazaar.Auction.model.ItemImages;
import com.auctionbazaar.Auction.repository.AuctionRepository;
import com.auctionbazaar.Auction.repository.ItemImagesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@Service
public class AuctionServiceImpl implements AuctionService {

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private ItemImagesRepository itemImagesRepository;

    @Autowired
    private com.auctionbazaar.Auction.repository.UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public Auction createAuction(Auction auction) {
        auction.setCreatedAt(new Date());
        auction.setUpdatedAt(new Date());
        Auction savedAuction = auctionRepository.save(auction);
        
        // Asynchronously notify admins of pending auction
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                java.util.List<com.auctionbazaar.Auction.model.User> admins = userRepository.findByRole(com.auctionbazaar.Auction.model.Role.ADMIN);
                String adminHtml = "<h3>New Auction Pending Approval</h3>" +
                                   "<p>A new auction <strong>" + savedAuction.getTitle() + "</strong> (ID: " + savedAuction.getId() + ") has been created by " + savedAuction.getCreatedBy() + ".</p>" +
                                   "<p>Please review and approve this auction in the Admin Dashboard.</p>";
                for (com.auctionbazaar.Auction.model.User admin : admins) {
                    emailService.sendEmail(admin.getEmail(), "Action Required: New Auction Pending Approval", adminHtml);
                }
            } catch (Exception e) {
                System.out.println("Failed to send admin notification email: " + e.getMessage());
            }
        });

        return savedAuction;
    }

    @Override
    public Auction getAuctionById(Long id) {
        return auctionRepository.findById(id)
                .orElseThrow(() -> new AuctionNotFoundException("Auction not found with id: " + id));
    }

    @Override
    public List<Auction> getAllAuctions() {
        return auctionRepository.findAll();
    }

    @Override
    public Auction updateAuction(Long id, Auction auctionDetails) {
        return auctionRepository.findById(id).map(auction -> {
            auction.setTitle(auctionDetails.getTitle());
            auction.setDescription(auctionDetails.getDescription());
            auction.setStartDateTime(auctionDetails.getStartDateTime());
            auction.setEndDateTime(auctionDetails.getEndDateTime());
            auction.setBasePrice(auctionDetails.getBasePrice());
            auction.setModifiedBy(auctionDetails.getModifiedBy());
            auction.setUpdatedAt(new Date());
            return auctionRepository.save(auction);
        }).orElseThrow(() -> new AuctionNotFoundException("Auction not found with id: " + id));
    }

    @Override
    public void deleteAuction(Long id) {
        if (!auctionRepository.existsById(id)) {
            throw new AuctionNotFoundException("Auction not found with id: " + id);
        }
        auctionRepository.deleteById(id);
    }

    @Override
    public ItemImages addImageToAuction(Long auctionId, MultipartFile file) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new AuctionNotFoundException("Auction not found with id: " + auctionId));

        ItemImages itemImage = new ItemImages();
        try {
            itemImage.setFilePath(file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
        itemImage.setAuction(auction);

        return itemImagesRepository.save(itemImage);
    }
    @Override
    public List<Auction> getAuctionsByUser(String createdBy) {
        return auctionRepository.findByCreatedBy(createdBy);
    }
    @Override
    public List<ItemImages> getImagesByAuctionId(Long auctionId) {
        return itemImagesRepository.findByAuctionId(auctionId);
    }
    @Override
    public void deleteImagesByAuctionId(Long auctionId) {
        // Check if the auction exists
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new AuctionNotFoundException("Auction not found with id: " + auctionId));

        // Fetch all images associated with the auction
        List<ItemImages> images = itemImagesRepository.findByAuctionId(auctionId);

        // Delete all images
        itemImagesRepository.deleteAll(images);
    }
    @Override
    public void deleteAuctionsByUser(String userId) {
        // Fetch all auctions associated with the user
        List<Auction> auctions = auctionRepository.findByCreatedBy(userId);

        // Delete all auctions
        auctionRepository.deleteAll(auctions);
    }
}