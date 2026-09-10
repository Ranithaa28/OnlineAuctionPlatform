import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { 
  FaArrowRight, FaCheck, FaTimes, FaUserShield, FaBan, FaCheckCircle, 
  FaGavel, FaUsers, FaChartLine, FaSignOutAlt, FaTrash, FaEnvelope, FaPaperPlane
} from "react-icons/fa";
import {
  getAllUsers, disableUser, enableUser, promoteUser, deleteUser,
  getPendingAuctions, getAllAuctions, approveAuction, rejectAuction, deleteAuction,
  testEmail
} from "../services/adminService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [pendingAuctions, setPendingAuctions] = useState([]);
  const [allAuctions, setAllAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Email Testing State
  const [testEmailAddress, setTestEmailAddress] = useState(user?.email || "");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      toast.error("Admin access only");
      navigate("/dashboard");
      return;
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, pendingAuctionsRes, allAuctionsRes] = await Promise.all([
        getAllUsers(),
        getPendingAuctions(),
        getAllAuctions()
      ]);
      setUsers(usersRes);
      setPendingAuctions(pendingAuctionsRes.data || pendingAuctionsRes || []);
      setAllAuctions(allAuctionsRes.data || allAuctionsRes || []);
    } catch (error) {
      toast.error("Error loading admin data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      logout();
      navigate("/signin");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const handleDisable = async (id) => { try { await disableUser(id); toast.success("User disabled"); loadData(); } catch (e) { toast.error(e.message); } };
  const handleEnable = async (id) => { try { await enableUser(id); toast.success("User enabled"); loadData(); } catch (e) { toast.error(e.message); } };
  const handlePromote = async (id) => { if (!window.confirm("Promote to ADMIN?")) return; try { await promoteUser(id); toast.success("Promoted"); loadData(); } catch (e) { toast.error(e.message); } };
  const handleApprove = async (id) => { try { await approveAuction(id); toast.success("Approved"); loadData(); } catch (e) { toast.error(e.message); } };
  const handleReject = async (id) => { try { await rejectAuction(id); toast.success("Rejected"); loadData(); } catch (e) { toast.error(e.message); } };
  const handleDeleteAuction = async (id) => { if (!window.confirm("Are you sure you want to delete this auction?")) return; try { await deleteAuction(id); toast.success("Auction deleted"); loadData(); } catch (e) { toast.error(e.message); } };
  const handleDeleteUser = async (id) => { if (!window.confirm("Are you sure you want to completely delete this user?")) return; try { await deleteUser(id); toast.success("User deleted"); loadData(); } catch (e) { toast.error(e.message); } };

  const handleTestEmail = async (e) => {
    e.preventDefault();
    if (!testEmailAddress) {
      toast.error("Please enter an email address.");
      return;
    }
    try {
      setIsSending(true);
      const res = await testEmail(testEmailAddress);
      toast.success(res.message || "Test email sent successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to send test email. Check your SMTP configuration.");
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-theme-primary"></div>
      </div>
    );
  }

  const totalUsers = users.length;
  const activeAuctions = allAuctions.filter(a => a.status === 'APPROVED').length;
  const pendingCount = pendingAuctions.length;

  const adminMenu = [
    {
      id: "overview",
      title: "Overview",
      icon: <FaChartLine className="w-8 h-8" />,
      description: "Platform metrics and diagnostics",
      gradient: "bg-gradient-to-br from-indigo-500 to-blue-500"
    },
    {
      id: "auctions",
      title: "Pending Approvals",
      icon: <FaCheckCircle className="w-8 h-8" />,
      description: "Moderate new auction listings",
      gradient: "bg-gradient-to-br from-emerald-500 to-teal-500",
      badge: pendingCount
    },
    {
      id: "users",
      title: "User Management",
      icon: <FaUsers className="w-8 h-8" />,
      description: "Manage accounts and roles",
      gradient: "bg-gradient-to-br from-violet-500 to-purple-500"
    },
    {
      id: "allAuctions",
      title: "All Auctions",
      icon: <FaGavel className="w-8 h-8" />,
      description: "Complete platform directory",
      gradient: "bg-gradient-to-br from-amber-500 to-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Matching Dashboard.jsx */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Admin Console, {user?.firstName}!
              </h1>
              <p className="text-gray-500 mt-1">Manage platform operations and settings</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-6 py-4 bg-white border border-gray-200 text-gray-800 rounded-full hover:bg-gray-50 hover:border-gray-300 transition transform hover:scale-105 shadow-md-sm"
            >
              <FaSignOutAlt className="mr-2 text-gray-500" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Navigation Cards - Matching Dashboard.jsx */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {adminMenu.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`${item.gradient} rounded-2xl shadow-md-lg p-8 cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-md-xl text-white hover:scale-105 relative ${activeTab === item.id ? 'ring-4 ring-white ring-opacity-50' : ''}`}
            >
              <div className="mb-6 opacity-90">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-2 flex items-center justify-between">
                {item.title}
                {item.badge > 0 && (
                  <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">{item.badge}</span>
                )}
              </h3>
              <p className="text-white/80">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Content Section based on selected tab */}
        <div className="bg-white rounded-2xl shadow-md-lg overflow-hidden border border-gray-100 p-6">
          
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
               <h2 className="text-3xl font-bold text-gray-800 flex items-center mb-8">
                <FaChartLine className="mr-3 text-theme-primary" /> Platform Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-6">
                  <div className="p-4 bg-theme-primary bg-opacity-10 rounded-2xl">
                    <FaUsers className="text-3xl text-theme-primary" />
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold mb-1">Total Users</p>
                    <h3 className="text-4xl font-bold text-gray-800">{totalUsers}</h3>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-6">
                  <div className="p-4 bg-theme-secondary bg-opacity-10 rounded-2xl">
                    <FaGavel className="text-3xl text-theme-secondary" />
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold mb-1">Active Auctions</p>
                    <h3 className="text-4xl font-bold text-gray-800">{activeAuctions}</h3>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-6">
                  <div className="p-4 bg-red-100 rounded-2xl">
                    <FaCheckCircle className="text-3xl text-red-500" />
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold mb-1">Pending Approvals</p>
                    <h3 className="text-4xl font-bold text-gray-800">{pendingCount}</h3>
                  </div>
                </div>
              </div>

              {/* Email Testing Tool */}
              <h2 className="text-3xl font-bold text-gray-800 flex items-center mb-6">
                <FaEnvelope className="mr-3 text-theme-secondary" /> Email Diagnostics
              </h2>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8">
                <p className="text-gray-600 mb-6">Verify SMTP configuration and background scheduler connectivity. By default, the system will mock email sending if the real SMTP password is missing.</p>
                <form onSubmit={handleTestEmail} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Test Delivery Address</label>
                    <input 
                      type="email" 
                      value={testEmailAddress}
                      onChange={(e) => setTestEmailAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-theme-primary"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSending}
                    className="flex items-center gap-2 px-8 py-3 bg-theme-primary hover:bg-theme-primary-dark text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
                  >
                    {isSending ? 'Sending...' : <><FaPaperPlane /> Fire Test Email</>}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Pending Auctions Tab */}
          {activeTab === "auctions" && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 flex items-center mb-8">
                <FaCheckCircle className="mr-3 text-theme-primary" /> Pending Approvals
              </h2>
              {pendingAuctions.length === 0 ? (
                <div className="text-center py-12">
                  <FaCheckCircle className="mx-auto h-12 w-12 text-green-300 mb-6" />
                  <p className="text-gray-500 text-lg">All caught up! No pending auctions require approval.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Base Price</th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingAuctions.map((a) => (
                        <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{a.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">{a.createdBy}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-theme-primary font-semibold">${a.basePrice}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button onClick={() => handleApprove(a.id)} className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium border border-green-100 flex items-center gap-2">
                                <FaCheck /> Approve
                              </button>
                              <button onClick={() => handleReject(a.id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-100 flex items-center gap-2">
                                <FaTimes /> Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 flex items-center mb-8">
                <FaUsers className="mr-3 text-theme-primary" /> User Management
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-800">{u.firstName} {u.lastName}</div>
                          <div className="text-sm text-gray-500">{u.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-4 py-1.5 inline-flex text-xs font-bold rounded-full border ${u.role === "ADMIN" ? "bg-theme-secondary bg-opacity-10 text-theme-secondary border-theme-secondary" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-4 py-1.5 inline-flex text-xs font-bold rounded-full border ${u.enabled ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                            {u.enabled ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-3">
                            {u.enabled ? (
                              <button onClick={() => handleDisable(u.id)} className="p-2 bg-orange-50 text-orange-500 hover:bg-orange-100 rounded-lg transition-colors border border-orange-100" title="Disable User">
                                <FaBan />
                              </button>
                            ) : (
                              <button onClick={() => handleEnable(u.id)} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors border border-green-100" title="Enable User">
                                <FaCheckCircle />
                              </button>
                            )}
                            {u.role !== "ADMIN" && (
                              <button onClick={() => handlePromote(u.id)} className="p-2 bg-theme-primary bg-opacity-10 text-theme-primary hover:bg-opacity-20 rounded-lg transition-colors border border-theme-primary border-opacity-20" title="Promote to Admin">
                                <FaUserShield />
                              </button>
                            )}
                            <button onClick={() => handleDeleteUser(u.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-100" title="Delete User">
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* All Auctions Tab */}
          {activeTab === "allAuctions" && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 flex items-center mb-8">
                <FaGavel className="mr-3 text-theme-primary" /> All Auctions
              </h2>
              {allAuctions.length === 0 ? (
                <div className="text-center py-12">
                  <FaGavel className="mx-auto h-12 w-12 text-gray-300 mb-6" />
                  <p className="text-gray-500 text-lg">No auctions found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Base Price</th>
                        <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allAuctions.map((a) => (
                        <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{a.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">{a.createdBy}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-theme-primary font-semibold">${a.basePrice}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                              a.status === 'APPROVED' ? 'bg-green-50 text-green-600 border-green-200' :
                              a.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                              'bg-red-50 text-red-600 border-red-200'
                            }`}>
                              {a.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button onClick={() => handleDeleteAuction(a.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-100" title="Delete Auction">
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;