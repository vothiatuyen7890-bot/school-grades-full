import Link from "next/link";
export default function Home(){ return (
  <main style={{padding:20}}>
    <h1>School Grades</h1>
    <p>A minimal template app (Next.js + Prisma).</p>
    <p><Link href="/login">Login</Link> · <Link href="/register">Register</Link></p>
  </main>
)}
