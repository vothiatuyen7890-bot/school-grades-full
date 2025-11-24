import { useEffect, useState } from 'react';
import Router from 'next/router';
export default function Dashboard(){
  const [me,setMe]=useState<any>(null);
  useEffect(()=>{ fetch('/api/auth/me').then(r=>r.json()).then(d=>{ if(d.error) Router.push('/login'); else setMe(d); }) },[]);
  if (!me) return <div className="p-6">Loading...</div>;
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dashboard — {me.name} ({me.role})</h1>
        <nav>
          <a className="mr-4" href="/">Home</a>
          <a className="mr-4" href="/profile">Profile</a>
        </nav>
      </header>
      {me.role==='ADMIN' ? <Admin /> : me.role==='TEACHER' ? <Teacher /> : <Student />}
    </div>
  );
}

function Admin(){ return <div><h2 className="text-xl font-medium">Admin panel</h2><p className="mt-2">Use admin UI to manage users and view statistics.</p><p className="mt-4"><a className="text-blue-600" href="/admin/users">Open Users</a></p></div> }
function Teacher(){ return <div><h2 className="text-xl font-medium">Teacher area</h2><p className="mt-2">Manage your classes and grades.</p><p className="mt-4"><a className="text-blue-600" href="/teacher/classes">Your Classes</a></p></div> }
function Student(){ return <div><h2 className="text-xl font-medium">Student area</h2><p className="mt-2">View your grades and history.</p><p className="mt-4"><a className="text-blue-600" href="/student/grades">My Grades</a></p></div> }
