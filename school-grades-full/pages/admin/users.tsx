import { useEffect, useState } from "react";
import Router from "next/router";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showEdit, setShowEdit] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  // Fields for editing
  const [editUser, setEditUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("STUDENT");

  // Fields for creation
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("STUDENT");

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEdit = (user) => {
    setEditUser(user);
    setEditName(user.name);
    setEditRole(user.role);
    setShowEdit(true);
  };

  const submitEdit = async () => {
    await fetch(`/api/admin/users/${editUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName,
        role: editRole,
      }),
    });

    setShowEdit(false);
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!confirm("Bạn chắc chắn muốn xóa user này?")) return;

    await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
    });

    fetchUsers();
  };

  const createUser = async () => {
    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole,
      }),
    });

    setShowCreate(false);
    setNewName("");
    setNewEmail("");
    setNewPassword("");
    fetchUsers();
  };

  if (loading) return <div className="p-6 text-xl">Loading...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Admin – Quản lý Users</h1>

      {/* Add User Button */}
      <button
        onClick={() => setShowCreate(true)}
        className="px-4 py-2 bg-green-600 text-white rounded mb-4"
      >
        + Thêm User
      </button>

      {/* User Table */}
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 border">ID</th>
            <th className="p-3 border">Tên</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Role</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="text-center border">
              <td className="p-3 border">{u.id}</td>
              <td className="p-3 border">{u.name}</td>
              <td className="p-3 border">{u.email}</td>
              <td className="p-3 border">{u.role}</td>
              <td className="p-3 border">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded mr-2"
                  onClick={() => openEdit(u)}
                >
                  Edit
                </button>

                <button
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => deleteUser(u.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* -------------------- EDIT MODAL -------------------- */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-3">Chỉnh sửa User</h2>

            <label className="block mb-2">Tên</label>
            <input
              className="w-full border p-2 mb-3"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <label className="block mb-2">Role</label>
            <select
              className="w-full border p-2 mb-4"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="TEACHER">TEACHER</option>
              <option value="STUDENT">STUDENT</option>
            </select>

            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={submitEdit}
            >
              Lưu
            </button>

            <button
              className="px-4 py-2 ml-2"
              onClick={() => setShowEdit(false)}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* -------------------- CREATE MODAL -------------------- */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-3">Thêm User mới</h2>

            <label className="block mb-1">Tên</label>
            <input
              className="w-full border p-2 mb-3"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <label className="block mb-1">Email</label>
            <input
              className="w-full border p-2 mb-3"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />

            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="w-full border p-2 mb-3"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <label className="block mb-1">Role</label>
            <select
              className="w-full border p-2 mb-4"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="TEACHER">TEACHER</option>
              <option value="STUDENT">STUDENT</option>
            </select>

            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={createUser}
            >
              Tạo User
            </button>

            <button
              className="px-4 py-2 ml-2"
              onClick={() => setShowCreate(false)}
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
