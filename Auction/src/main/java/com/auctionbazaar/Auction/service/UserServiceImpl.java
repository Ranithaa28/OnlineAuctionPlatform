package com.auctionbazaar.Auction.service;

import com.auctionbazaar.Auction.exception.EmailAlreadyExistsException;
import com.auctionbazaar.Auction.exception.UserNotFoundException;
import com.auctionbazaar.Auction.model.User;
import com.auctionbazaar.Auction.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists: " + user.getEmail());
        }

        user.setCreatedAt(new Date());
        user.setUpdatedAt(new Date());

        return userRepository.save(user);
    }

    @Override
    public User login(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password))
                .orElseThrow(() -> new RuntimeException("Login Failed: Invalid email or password"));
    }

    @Override
    public User updateProfile(Long id, User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setFirstName(userDetails.getFirstName());
            user.setLastName(userDetails.getLastName());
            user.setPhoneNumber(userDetails.getPhoneNumber());
            user.setUpdatedBy(userDetails.getUpdatedBy());
            user.setUpdatedAt(new Date());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    @Override
    public void deleteProfile(Long id) {
        // Check if the user exists
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User not found with id: " + id);
        }

        // Delete the user
        userRepository.deleteById(id);
    }


}
