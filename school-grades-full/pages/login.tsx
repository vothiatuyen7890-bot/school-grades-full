import { useState } from 'react';
import Router from 'next/router';

export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  async function submit(e){ e.preventDefault();
    const res = await fetch('/api/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password})});
    if (res.ok) Router.push('/dashboard');
    else alert('Login failed');
  }
  return (<main style={{padding:20}}>
    <h2>Login</h2>
    <form onSubmit={submit}>
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} /><br/>
      <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /><br/>
      <button>Login</button>
    </form>
  </main>);
}
