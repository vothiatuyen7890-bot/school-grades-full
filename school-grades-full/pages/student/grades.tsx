import { useEffect, useState } from 'react';
export default function StudentGrades(){
  const [grades,setGrades]=useState<any[]>([]);
  useEffect(()=>{ fetch('/api/grades').then(r=>r.json()).then(d=>setGrades(d)) },[]);
  return <main className="p-6 max-w-3xl mx-auto">
    <h1 className="text-2xl mb-4">My Grades</h1>
    <ul>{grades.map(g=> <li key={g.id} className="p-2 border mb-2">{g.subject}: {g.value}</li>)}</ul>
  </main>
}
