import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { getUserFromReq } from "../../../../lib/auth";
import { logActivity } from "../../../../lib/activity";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const { id } = req.query as any;
  const user = await getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const cls = await prisma.class.findUnique({ where: { id }, include: { teacher: { include: { user: true } }, students: { include: { user: true } } }});
  if (!cls) return res.status(404).json({ error: "Not found" });

  if (req.method === "GET") {
    if (user.role === "ADMIN" || (user.role === "TEACHER" && cls.teacher.userId === user.id)) return res.json(cls);
    return res.status(403).json({ error: "Forbidden" });
  }

  if (req.method === "PATCH") {
    if (!(user.role === "ADMIN" || (user.role === "TEACHER" && cls.teacher.userId === user.id))) return res.status(403).json({ error: "Forbidden" });
    const { name, teacherId } = req.body;
    const updated = await prisma.class.update({ where: { id }, data: { name: name || cls.name, teacherId: teacherId || cls.teacherId }});
    await logActivity(user.id, "class:update", { classId: id });
    return res.json(updated);
  }

  if (req.method === "DELETE") {
    if (!(user.role === "ADMIN" || (user.role === "TEACHER" && cls.teacher.userId === user.id))) return res.status(403).json({ error: "Forbidden" });
    await prisma.class.delete({ where: { id }});
    await logActivity(user.id, "class:delete", { classId: id });
    return res.status(204).end();
  }

  return res.status(405).end();
}
