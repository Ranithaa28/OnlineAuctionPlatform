package com.auctionbazaar.Auction.repository;

import com.auctionbazaar.Auction.model.Auction;
import com.auctionbazaar.Auction.model.AuctionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuctionRepository extends JpaRepository<Auction, Long> {
    List<Auction> findByCreatedBy(String createdBy);
    List<Auction> findByStatus(AuctionStatus status);
}