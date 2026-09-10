package com.auctionbazaar.Auction.service;

import com.auctionbazaar.Auction.model.Auction;
import com.auctionbazaar.Auction.model.ItemImages;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AuctionService {
    Auction createAuction(Auction auction);
    Auction getAuctionById(Long id);
    List<Auction> getAllAuctions();
    Auction updateAuction(Long id, Auction auctionDetails);
    void deleteAuction(Long id);
    ItemImages addImageToAuction(Long auctionId, MultipartFile file);
    List<Auction> getAuctionsByUser(String createdBy);// New method
    List<ItemImages> getImagesByAuctionId(Long auctionId);
    void deleteImagesByAuctionId(Long auctionId);
    void deleteAuctionsByUser(String userId);
}