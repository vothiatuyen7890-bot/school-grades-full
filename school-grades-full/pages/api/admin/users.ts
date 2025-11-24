import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getUserFromReq } from "../../../lib/auth";
import bcrypt from "bcryptjs";
import { logActivity } from "../../../lib/activity";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const user = await getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  if (user.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });

  if (req.method === "GET") {
    const users = await prisma.user.findMany({ select: { id:true, email:true, name:true, role:true, createdAt:true }});
    return res.json(users);
  }

  if (req.method === "POST") {
    const { email, name, password, role } = req.body;
    const hash = await bcrypt.hash(password || "password123", 10);
    const u = await prisma.user.create({ data: { email, name, password: hash, role }});
    if (role === "TEACHER") await prisma.teacher.create({ data: { userId: u.id }});
    if (role === "STUDENT") await prisma.student.create({ data: { userId: u.id }});
    await logActivity(user.id, "admin:user:create", { userId: u.id, role });
    return res.status(201).json({ id: u.id, email: u.email, role: u.role });
  }

  return res.status(405).end();
}
