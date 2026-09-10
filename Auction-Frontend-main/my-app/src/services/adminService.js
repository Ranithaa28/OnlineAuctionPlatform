const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getAllUsers = async () => {
  const response = await fetch(`${API_BASE}/admin/users`, { headers: authHeaders() });
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

export const disableUser = async (userId) => {
  const response = await fetch(`${API_BASE}/admin/users/${userId}/disable`, { method: "PUT", headers: authHeaders() });
  if (!response.ok) throw new Error("Failed to disable user");
  return response.json();
};

export const enableUser = async (userId) => {
  const response = await fetch(`${API_BASE}/admin/users/${userId}/enable`, { method: "PUT", headers: authHeaders() });
  if (!response.ok) throw new Error("Failed to enable user");
  return response.json();
};

export const promoteUser = async (userId) => {
  const response = await fetch(`${API_BASE}/admin/users/${userId}/promote`, { method: "PUT", headers: authHeaders() });
  if (!response.ok) throw new Error("Failed to promote user");
  return response.json();
};

export const getPendingAuctions = async () => {
  const response = await fetch(`${API_BASE}/admin/auctions/pending`, { headers: authHeaders() });
  if (!response.ok) throw new Error("Failed to fetch pending auctions");
  return response.json();
};

export const getAllAuctions = async () => {
  const response = await fetch(`${API_BASE}/admin/auctions`, { headers: authHeaders() });
  if (!response.ok) throw new Error("Failed to fetch all auctions");
  return response.json();
};

export const approveAuction = async (auctionId) => {
  const response = await fetch(`${API_BASE}/admin/auctions/${auctionId}/approve`, { method: "PUT", headers: authHeaders() });
  if (!response.ok) throw new Error("Failed to approve auction");
  return response.json();
};

export const rejectAuction = async (auctionId) => {
  const response = await fetch(`${API_BASE}/admin/auctions/${auctionId}/reject`, { method: "PUT", headers: authHeaders() });
  if (!response.ok) throw new Error("Failed to reject auction");
  return response.json();
};

export const deleteAuction = async (auctionId) => {
  const response = await fetch(`${API_BASE}/admin/auctions/${auctionId}`, { method: "DELETE", headers: authHeaders() });
  if (!response.ok) throw new Error("Failed to delete auction");
  return response.json();
};

export const deleteUser = async (userId) => {
  const response = await fetch(`${API_BASE}/admin/users/${userId}`, { method: "DELETE", headers: authHeaders() });
  if (!response.ok) throw new Error("Failed to delete user");
  return response.json();
};

export const testEmail = async (email) => {
  const response = await fetch(`${API_BASE}/admin/test-email`, { 
    method: "POST", 
    headers: authHeaders(),
    body: JSON.stringify({ email })
  });
  if (!response.ok) throw new Error("Failed to send test email");
  return response.json();
};