import { useEffect, useState } from 'react';
import Router from 'next/router';

export default function AdminUsers(){
  const [users,setUsers]=useState<any[]>([]);
  const [email,setEmail]=useState(''); const [name,setName]=useState(''); const [role,setRole]=useState('STUDENT'); const [password,setPassword]=useState('');
  useEffect(()=>{ fetch('/api/admin/users').then(r=>r.json()).then(d=>{ if(d.error) Router.push('/login'); else setUsers(d); }) },[]);

  async function create(e:any){
    e.preventDefault();
    const res = await fetch('/api/admin/users',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({ email, name, password, role })});
    if (res.ok) { alert('Created'); const u = await res.json(); setUsers([u, ...users]); } else alert('Failed');
  }
  <button
  className="px-3 py-1 bg-blue-600 text-white rounded"
  onClick={() => {
      setEditUser(user); // lưu vào state
      setShowEdit(true); // mở modal
  }}
>
  Edit
</button>

<button
  className="px-3 py-1 bg-red-600 text-white rounded ml-2"
  onClick={async () => {
      await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      refreshUsers(); // reload list
  }}
>
  Delete
</button>
  return <main className="p-6 max-w-4xl mx-auto">
    <h1 className="text-2xl mb-4">Manage Users</h1>
    <form onSubmit={create} className="grid grid-cols-4 gap-2 mb-4">
      <input placeholder="name" value={name} onChange={e=>setName(e.target.value)} className="border p-2" />
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} className="border p-2" />
      <input placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} className="border p-2" />
      <select value={role} onChange={e=>setRole(e.target.value)} className="border p-2">
        <option value="ADMIN">ADMIN</option>
        <option value="TEACHER">TEACHER</option>
        <option value="STUDENT">STUDENT</option>
      </select>
      <div className="col-span-4"><button className="px-4 py-2 bg-green-600 text-white rounded">Create User</button></div>
    </form>

    <table className="w-full border">
      <thead><tr className="bg-gray-100"><th className="p-2">Name</th><th>Email</th><th>Role</th><th>Created</th></tr></thead>
      <tbody>
        {users.map(u=> <tr key={u.id}><td className="p-2">{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{new Date(u.createdAt).toLocaleString()}</td></tr>)}
      </tbody>
    </table>
  </main>
}
