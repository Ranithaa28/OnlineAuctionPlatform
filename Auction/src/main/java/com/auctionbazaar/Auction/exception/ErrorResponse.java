package com.auctionbazaar.Auction.exception;


public class ErrorResponse {
    private String message;
    private int statusCode;

    // Constructor
    public ErrorResponse(String message, int statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }

    // Getters
    public String getMessage() {
        return message;
    }

    public int getStatusCode() {
        return statusCode;
    }
}