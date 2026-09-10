package com.auctionbazaar.Auction.repository;

import com.auctionbazaar.Auction.model.Bid;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByAuctionId(Long auctionId); // Find bids by auctionId
    @Transactional
    @Modifying
    @Query("DELETE FROM Bid b WHERE b.auctionId = :auctionId")
    int deleteByAuctionId(Long auctionId);

    @Transactional
    int deleteByUserId(Long userId);
}