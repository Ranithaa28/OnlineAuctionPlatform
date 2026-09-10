const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error(error.message || "Failed to login. Please try again.");
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${API_BASE}/users/me`, {
      method: "GET",
      headers: authHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) {
         // Token is invalid or user is disabled
         localStorage.removeItem("user");
         localStorage.removeItem("token");
      }
      throw new Error("Failed to fetch user");
    }
    const data = await response.json();
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateUserDetails = async (userData) => {
  try {
    const response = await fetch(`${API_BASE}/users/${userData.id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Update failed");
    }
    return response.json();
  } catch (error) {
    console.error("Error during update:", error);
    throw error;
  }
};

const deleteUserBids = async (userId) => {
  const response = await fetch(`${API_BASE}/bids/user/${userId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to delete user's bids");
  }
  return response;
};

const deleteUserAuctions = async (userId) => {
  const response = await fetch(`${API_BASE}/auctions/user/${userId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to delete user's auctions");
  }
  return response;
};

export const deleteUser = async (userId) => {
  try {
    await deleteUserBids(userId);
    await deleteUserAuctions(userId);

    const response = await fetch(`${API_BASE}/users/${userId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Failed to delete user (Status: ${response.status})`);
    }
    return { success: true, message: "Account deleted successfully" };
  } catch (error) {
    console.error("Error during deletion:", error);
    throw new Error(error.message || "Failed to delete user account. Please try again later.");
  }
};

export const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};