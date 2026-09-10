package com.auctionbazaar.Auction.repository;



import com.auctionbazaar.Auction.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByFirstName(String firstName); // Add this method to find by name

    java.util.List<User> findByRole(com.auctionbazaar.Auction.model.Role role);
}