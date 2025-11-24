import { useEffect, useState } from 'react';
import Router from 'next/router';

export default function Profile(){
  const [me,setMe]=useState<any>(null);
  const [name,setName]=useState('');
  const [password,setPassword]=useState('');
  useEffect(()=>{ fetch('/api/auth/me').then(r=>r.json()).then(d=>{ if(d.error) Router.push('/login'); else { setMe(d); setName(d.name); } }) },[]);
  if (!me) return <div className="p-6">Loading...</div>;

  async function save(e:any){
    e.preventDefault();
    const res = await fetch('/api/auth/me_patch',{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({ name, password })});
    if (res.ok) { alert('Saved'); Router.push('/dashboard'); } else alert('Failed');
  }

  return <main className="p-6 max-w-2xl mx-auto">
    <h1 className="text-2xl mb-4">Profile</h1>
    <form onSubmit={save} className="space-y-3">
      <div><label className="block">Name</label><input className="border p-2 w-full" value={name} onChange={e=>setName(e.target.value)} /></div>
      <div><label className="block">New password (leave blank to keep)</label><input className="border p-2 w-full" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
      <div><button className="px-4 py-2 bg-blue-600 text-white rounded">Save</button></div>
    </form>
  </main>
}
