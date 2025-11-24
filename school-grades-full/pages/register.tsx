import { useState } from 'react';
export default function Register(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [name,setName]=useState('');
  async function submit(e){ e.preventDefault();
    const res = await fetch('/api/auth/register',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password,name})});
    if (res.ok) alert('Registered - now login');
    else alert('Failed');
  }
  return (<main style={{padding:20}}>
    <h2>Register</h2>
    <form onSubmit={submit}>
      <input placeholder="name" value={name} onChange={e=>setName(e.target.value)} /><br/>
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} /><br/>
      <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /><br/>
      <button>Register</button>
    </form>
  </main>);
}
