package com.auctionbazaar.Auction.repository;

import com.auctionbazaar.Auction.model.ItemImages;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemImagesRepository extends JpaRepository<ItemImages, Long> {
    List<ItemImages> findByAuctionId(Long auctionId);
}