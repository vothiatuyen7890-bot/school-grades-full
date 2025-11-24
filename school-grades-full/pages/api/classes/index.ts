import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getUserFromReq } from "../../../lib/auth";
import { logActivity } from "../../../lib/activity";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const user = await getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    if (user.role === "ADMIN") {
      const cls = await prisma.class.findMany({ include: { teacher: { include: { user: true } }, students: { include: { user: true } } }});
      return res.json(cls);
    } else if (user.role === "TEACHER") {
      const teacher = await prisma.teacher.findUnique({ where: { userId: user.id }, include: { classes: { include: { students: { include: { user: true } } } } }});
      return res.json(teacher?.classes || []);
    }
    return res.status(403).json({ error: "Forbidden" });
  }

  if (req.method === "POST") {
    // only admin or teacher can create class (teacher creates for themselves)
    const { name, teacherId } = req.body;
    if (user.role === "TEACHER") {
      const t = await prisma.teacher.findUnique({ where: { userId: user.id }});
      const newc = await prisma.class.create({ data: { name, teacherId: t.id }});
      await logActivity(user.id, "class:create", { classId: newc.id });
      return res.status(201).json(newc);
    } else if (user.role === "ADMIN") {
      const newc = await prisma.class.create({ data: { name, teacherId }});
      await logActivity(user.id, "class:create", { classId: newc.id });
      return res.status(201).json(newc);
    }
    return res.status(403).json({ error: "Forbidden" });
  }

  return res.status(405).end();
}
