import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout/AdminLayout";
import axios from "axios";
import "./AllUsers.css"; // ✅ create this CSS file if needed

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchPaidUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("/api/admin/paid-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data.users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchPaidUsers();
  }, []);

  return (
    <AdminLayout>
      <div className="users-page">
        <h1 className="page-title">All Users Who Purchased Courses</h1>
        <div className="user-table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Courses</th>
              </tr>
            </thead>
            <tbody>
  {users?.filter(Boolean).map((user, index) => (
    <tr key={user?._id || index}>
      <td>{index + 1}</td>
      <td>{user?.name || "N/A"}</td>
      <td>{user?.email || "N/A"}</td>
      <td>{user?.phoneNumber || "N/A"}</td>
      <td>
        <ul>
          {user?.enrolledCourses
            ?.filter(
              (ec) => ec?.status === "unlocked" && ec?.courseId
            )
            .map((ec, i) => (
              <li key={ec?.courseId?._id || i}>
                {ec?.courseId?.name || "Course removed"}
              </li>
            ))}
        </ul>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AllUsers;
