package com.auctionbazaar.Auction.service;

public interface EmailService {
    String sendEmail(String to, String subject, String body);
    String wrapInEmailTemplate(String accentColor, String headerIcon, String headerTitle, String bodyContent);
}