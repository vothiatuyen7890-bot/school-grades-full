import { useEffect, useState } from 'react';
export default function TeacherClasses(){
  const [classes,setClasses]=useState<any[]>([]);
  const [name,setName]=useState('');
  useEffect(()=>{ fetch('/api/classes').then(r=>r.json()).then(d=>setClasses(d)) },[]);
  async function create(e:any){
    e.preventDefault();
    const res = await fetch('/api/classes',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({ name })});
    if (res.ok){ const c = await res.json(); setClasses([c, ...classes]); setName(''); } else alert('Failed');
  }
  return <main className="p-6 max-w-3xl mx-auto">
    <h1 className="text-2xl mb-4">Your Classes</h1>
    <form onSubmit={create} className="mb-4"><input value={name} onChange={e=>setName(e.target.value)} className="border p-2 mr-2" placeholder="Class name" /><button className="px-3 py-1 bg-blue-600 text-white">Create</button></form>
    <ul>{classes.map(c=> <li key={c.id} className="p-2 border mb-2"><strong>{c.name}</strong> — Teacher: {c.teacher?.user?.name || '—'}</li>)}</ul>
  </main>
}
