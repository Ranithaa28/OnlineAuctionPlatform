package com.auctionbazaar.Auction.service;

public interface EmailService {
    String sendEmail(String to, String subject, String text);
}