import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, password, name, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "Email exists" });

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hash, name: name || email.split("@")[0], role: role || "STUDENT" },
  });

  if (user.role === "TEACHER") {
    await prisma.teacher.create({ data: { userId: user.id }});
  } else if (user.role === "STUDENT") {
    await prisma.student.create({ data: { userId: user.id }});
  }

  res.status(201).json({ id: user.id, email: user.email, role: user.role });
}
