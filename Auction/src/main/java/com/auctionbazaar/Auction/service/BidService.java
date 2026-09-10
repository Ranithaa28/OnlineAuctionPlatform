package com.auctionbazaar.Auction.service;

import com.auctionbazaar.Auction.model.Bid;
import java.util.List;

public interface BidService {
    Bid createBid(Bid bid); // Create a new bid
    List<Bid> getBidsByAuctionId(Long auctionId); // Get bids by auctionId
    int deleteBidsByAuctionId(Long auctionId);
    int deleteBidsByUserId(Long userId);
}