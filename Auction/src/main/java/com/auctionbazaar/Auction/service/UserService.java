package com.auctionbazaar.Auction.service;


import com.auctionbazaar.Auction.model.User;

public interface UserService {
    User registerUser(User user); // New method for registration
    User login(String email, String password);
    User updateProfile(Long id, User userDetails);
    void deleteProfile(Long id);
}