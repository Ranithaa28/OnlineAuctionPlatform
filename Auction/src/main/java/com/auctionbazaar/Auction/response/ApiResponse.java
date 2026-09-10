package com.auctionbazaar.Auction.response;


public class ApiResponse<T> {
    private String statusMessage;
    private int statusCode;
    private T data;

    // Constructor
    public ApiResponse(String statusMessage, int statusCode, T data) {
        this.statusMessage = statusMessage;
        this.statusCode = statusCode;
        this.data = data;
    }

    // Getters
    public String getStatusMessage() {
        return statusMessage;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public T getData() {
        return data;
    }
}
