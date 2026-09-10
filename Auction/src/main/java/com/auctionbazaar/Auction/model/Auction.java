package com.auctionbazaar.Auction.model;


import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Auction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private Date startDateTime;
    private Date endDateTime;
    private double basePrice;
    private String createdBy;
    private String modifiedBy;

    private Long ownerId;

@Enumerated(jakarta.persistence.EnumType.STRING)
private AuctionStatus status = AuctionStatus.PENDING;

private boolean endEmailsSent = false;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(Date startDateTime) {
        this.startDateTime = startDateTime;
    }

    public Date getEndDateTime() {
        return endDateTime;
    }

    public void setEndDateTime(Date endDateTime) {
        this.endDateTime = endDateTime;
    }

    public double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(double basePrice) {
        this.basePrice = basePrice;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(String modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getOwnerId() {
    return ownerId;
}

public void setOwnerId(Long ownerId) {
    this.ownerId = ownerId;
}

public AuctionStatus getStatus() {
    return status;
}

public void setStatus(AuctionStatus status) {
    this.status = status;
}

public boolean isEndEmailsSent() {
    return endEmailsSent;
}

public void setEndEmailsSent(boolean endEmailsSent) {
    this.endEmailsSent = endEmailsSent;
}
}