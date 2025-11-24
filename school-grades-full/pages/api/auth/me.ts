import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import prisma from "../../../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "change_this";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.headers.cookie || "";
  const m = cookie.split(";").map(s => s.trim()).find(s => s.startsWith("token="));
  if (!m) return res.status(401).json({ error: "Not authenticated" });
  const token = m.replace("token=", "");
  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId }});
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
