import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/a.css";

const RoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/users");
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Error fetching users!");
      setLoading(false);
    }
  };

  // ✅ Handle role update
  const updateRole = async (id, newRole) => {
    try {
      await axios.put(`http://localhost:8081/api/users/${id}/role`, {
        role: newRole,
      });
      alert("Role updated successfully!");
      fetchUsers(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Error updating role!");
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="table-container">
      <h2>Manage User Roles</h2>
      <table className="role-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Current Role</th>
            <th>Assign Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => updateRole(u.id, e.target.value)}
                >
                  <option value="USER">User</option>
                  <option value="VERIFICATION">Verification Officer</option>
                  <option value="MANAGER">Manager Approval</option>
                  <option value="SERVICE_MANAGER">External Service Manager</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleManagement;
