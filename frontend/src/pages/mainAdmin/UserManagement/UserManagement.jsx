import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "../AdminLayout/AdminLayout";
import axios from "axios";
import { FaUserPlus, FaSearch, FaBookOpen, FaTimes, FaCheck } from "react-icons/fa";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    city: "",
    selectedCategory: "CAT",
    selectedExam: "",
  });

  const [enrollData, setEnrollData] = useState({
    courseId: "",
    validityMonths: 12,
  });

  const getHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/all-users-list", {
        headers: getHeaders(),
        params: { search: searchTerm, page, limit: 30 },
      });
      if (res.data.success) {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, page]);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await axios.get("/api/admin/all-courses-list", {
        headers: getHeaders(),
      });
      if (res.data.success) {
        setCourses(res.data.courses);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await axios.post("/api/admin/create-user", newUser, {
        headers: getHeaders(),
      });
      if (res.data.success) {
        showToast("User created successfully!");
        setShowCreateModal(false);
        setNewUser({ name: "", email: "", phoneNumber: "", gender: "", city: "", selectedCategory: "CAT", selectedExam: "" });
        fetchUsers();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create user", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEnrollUser = async (e) => {
    e.preventDefault();
    if (!selectedUser || !enrollData.courseId) {
      showToast("Please select a course", "error");
      return;
    }
    setActionLoading(true);
    try {
      const res = await axios.post(
        "/api/admin/enroll-user",
        {
          userId: selectedUser._id,
          courseId: enrollData.courseId,
          validityMonths: enrollData.validityMonths,
        },
        { headers: getHeaders() }
      );
      if (res.data.success) {
        showToast(res.data.message);
        setShowEnrollModal(false);
        setEnrollData({ courseId: "", validityMonths: 12 });
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to enroll user", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveEnrollment = async (userId, courseId, courseName) => {
    if (!window.confirm(`Remove enrollment for "${courseName}"?`)) return;
    try {
      const res = await axios.post(
        "/api/admin/remove-enrollment",
        { userId, courseId },
        { headers: getHeaders() }
      );
      if (res.data.success) {
        showToast("Enrollment removed");
        fetchUsers();
      }
    } catch (err) {
      showToast("Failed to remove enrollment", "error");
    }
  };

  const openEnrollModal = (user) => {
    setSelectedUser(user);
    setEnrollData({ courseId: "", validityMonths: 12 });
    setShowEnrollModal(true);
  };

  const getEnrolledCourseIds = (user) => {
    return (user.enrolledCourses || [])
      .filter((e) => e.status === "unlocked" && e.courseId)
      .map((e) => (typeof e.courseId === "object" ? e.courseId._id : e.courseId));
  };

  const availableCoursesForUser = selectedUser
    ? courses.filter((c) => !getEnrolledCourseIds(selectedUser).includes(c._id))
    : courses;

  return (
    <AdminLayout>
      <div className="um-container">
        {toast && (
          <div className={`um-toast ${toast.type}`}>
            {toast.type === "success" ? <FaCheck /> : <FaTimes />}
            {toast.message}
          </div>
        )}

        <div className="um-header">
          <div>
            <h1>User Management</h1>
            <p>Create users and manage course enrollments</p>
          </div>
          <button className="um-btn um-btn-primary" onClick={() => setShowCreateModal(true)}>
            <FaUserPlus /> Create New User
          </button>
        </div>

        <div className="um-search-bar">
          <FaSearch className="um-search-icon" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {loading ? (
          <div className="um-loading">
            <div className="um-spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <>
            <div className="um-table-wrapper">
              <table className="um-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Category</th>
                    <th>Enrolled Courses</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="um-empty">No users found</td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id}>
                        <td className="um-name">{user.name || "—"}</td>
                        <td>{user.email || "—"}</td>
                        <td>{user.phoneNumber || "—"}</td>
                        <td>{user.selectedCategory || "—"}</td>
                        <td>
                          <div className="um-enrolled-list">
                            {(user.enrolledCourses || [])
                              .filter((e) => e.status === "unlocked" && e.courseId)
                              .map((e, i) => {
                                const course = typeof e.courseId === "object" ? e.courseId : null;
                                return (
                                  <span key={i} className="um-course-badge">
                                    {course ? course.name : "Course"}
                                    <button
                                      className="um-badge-remove"
                                      title="Remove enrollment"
                                      onClick={() =>
                                        handleRemoveEnrollment(
                                          user._id,
                                          course ? course._id : e.courseId,
                                          course ? course.name : "this course"
                                        )
                                      }
                                    >
                                      <FaTimes />
                                    </button>
                                  </span>
                                );
                              })}
                            {(user.enrolledCourses || []).filter((e) => e.status === "unlocked").length === 0 && (
                              <span className="um-no-courses">No courses</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <button className="um-btn um-btn-enroll" onClick={() => openEnrollModal(user)}>
                            <FaBookOpen /> Enroll
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="um-pagination">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {showCreateModal && (
          <div className="um-modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="um-modal" onClick={(e) => e.stopPropagation()}>
              <div className="um-modal-header">
                <h2>Create New User</h2>
                <button className="um-modal-close" onClick={() => setShowCreateModal(false)}>
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleCreateUser}>
                <div className="um-form-grid">
                  <div className="um-form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      required
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="um-form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="um-form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={newUser.phoneNumber}
                      onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                      placeholder="10-digit phone number"
                      maxLength={10}
                    />
                  </div>
                  <div className="um-form-group">
                    <label>Gender</label>
                    <select value={newUser.gender} onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="um-form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={newUser.city}
                      onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="um-form-group">
                    <label>Category</label>
                    <select
                      value={newUser.selectedCategory}
                      onChange={(e) => setNewUser({ ...newUser, selectedCategory: e.target.value })}
                    >
                      <option value="CAT">CAT</option>
                      <option value="XAT">XAT</option>
                      <option value="SNAP">SNAP</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="um-form-group">
                    <label>Target Exam</label>
                    <input
                      type="text"
                      value={newUser.selectedExam}
                      onChange={(e) => setNewUser({ ...newUser, selectedExam: e.target.value })}
                      placeholder="e.g. CAT 2025"
                    />
                  </div>
                </div>
                <p className="um-form-note">* Name and at least one of email or phone is required</p>
                <div className="um-modal-actions">
                  <button type="button" className="um-btn um-btn-cancel" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="um-btn um-btn-primary" disabled={actionLoading}>
                    {actionLoading ? "Creating..." : "Create User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEnrollModal && selectedUser && (
          <div className="um-modal-overlay" onClick={() => setShowEnrollModal(false)}>
            <div className="um-modal" onClick={(e) => e.stopPropagation()}>
              <div className="um-modal-header">
                <h2>Enroll User in Course</h2>
                <button className="um-modal-close" onClick={() => setShowEnrollModal(false)}>
                  <FaTimes />
                </button>
              </div>
              <div className="um-enroll-user-info">
                <strong>{selectedUser.name || "Unnamed"}</strong>
                <span>{selectedUser.email || selectedUser.phoneNumber || ""}</span>
              </div>
              <form onSubmit={handleEnrollUser}>
                <div className="um-form-group">
                  <label>Select Course *</label>
                  <select
                    required
                    value={enrollData.courseId}
                    onChange={(e) => setEnrollData({ ...enrollData, courseId: e.target.value })}
                  >
                    <option value="">-- Select a course --</option>
                    {availableCoursesForUser.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.name} {course.price ? `(₹${course.price})` : ""}
                      </option>
                    ))}
                  </select>
                  {availableCoursesForUser.length === 0 && (
                    <p className="um-form-note">All courses are already enrolled</p>
                  )}
                </div>
                <div className="um-form-group">
                  <label>Validity (Months)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={enrollData.validityMonths}
                    onChange={(e) => setEnrollData({ ...enrollData, validityMonths: parseInt(e.target.value) || 12 })}
                  />
                </div>
                <div className="um-modal-actions">
                  <button type="button" className="um-btn um-btn-cancel" onClick={() => setShowEnrollModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="um-btn um-btn-primary" disabled={actionLoading || !enrollData.courseId}>
                    {actionLoading ? "Enrolling..." : "Enroll Now"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
