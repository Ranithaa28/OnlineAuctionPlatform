const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

const authHeaders = (isJson = true) => {
  const token = localStorage.getItem("token");
  return {
    ...(isJson ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getAuctionDetails = async (auctionId) => {
  try {
    const response = await fetch(`${API_BASE}/auctions/${auctionId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch auction details");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching auction details:", error);
    throw error;
  }
};

export const updateAuctionDetails = async (auctionId, auctionData) => {
  try {
    const response = await fetch(`${API_BASE}/auctions/${auctionId}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(auctionData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Auction update failed");
    }
    return response.json();
  } catch (error) {
    console.error("Error updating auction:", error);
    throw error;
  }
};

export const createAuction = async (auctionData) => {
  try {
    const response = await fetch(`${API_BASE}/auctions`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(auctionData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Auction creation failed");
    }
    return response.json();
  } catch (error) {
    console.error("Error during auction creation:", error);
    throw error;
  }
};

export const uploadAuctionImage = async (auctionId, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE}/auctions/${auctionId}/images`, {
      method: "POST",
      headers: authHeaders(false), // no Content-Type - browser sets multipart boundary
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "File upload failed");
    }
    return response.json();
  } catch (error) {
    console.error("Error during file upload:", error);
    throw error;
  }
};

export const getUserAuctions = async (userName) => {
  try {
    const response = await fetch(`${API_BASE}/auctions/user/${encodeURIComponent(userName)}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch user auctions");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching user auctions:", error);
    throw error;
  }
};

export const deleteAuction = async (auctionId) => {
  try {
    // Note: bid cleanup is now admin-only on the backend, so we skip it here.
    // The backend should ideally cascade-delete bids when an auction is removed.

    const deleteImagesResponse = await fetch(`${API_BASE}/auctions/${auctionId}/images`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!deleteImagesResponse.ok) {
      const errorData = await deleteImagesResponse.json();
      throw new Error(errorData.message || `Failed to delete images for auction ${auctionId}`);
    }

    const response = await fetch(`${API_BASE}/auctions/${auctionId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Auction deletion failed");
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting auction:", error);
    throw error;
  }
};