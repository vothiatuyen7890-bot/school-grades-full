import jwt from "jsonwebtoken";
import prisma from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "change_this";

export function getTokenFromHeaderOrCookie(req:any){
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) return auth.split(" ")[1];
  const cookie = req.headers.cookie || "";
  const m = cookie.split(";").map((s:string)=>s.trim()).find((s:string)=>s.startsWith("token="));
  return m ? m.replace("token=","") : null;
}

export async function getUserFromReq(req:any){
  const token = getTokenFromHeaderOrCookie(req);
  if (!token) return null;
  try {
    const payload:any = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId }});
    return user;
  } catch(e){
    return null;
  }
}

export function requireRole(user:any, roles:string[]){ 
  if (!user) return false;
  return roles.includes(user.role);
}
