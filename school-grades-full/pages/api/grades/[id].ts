import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { getUserFromReq, requireRole } from "../../../../lib/auth";
import { logActivity } from "../../../../lib/activity";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const { id } = req.query as any;
  const user = await getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  // fetch grade with student and student's class + teacher
  const grade = await prisma.grade.findUnique({ where: { id }, include: { student: { include: { user: true, class: { include: { teacher: true } } } } }});
  if (!grade) return res.status(404).json({ error: "Not found" });

  if (req.method === "GET") {
    // access control: admin sees all, teacher sees if they teach the class, student sees own
    if (user.role === "ADMIN" || (user.role === "TEACHER" && grade.student?.class?.teacher?.userId === user.id) || (user.role === "STUDENT" && grade.student?.userId === user.id)) {
      return res.json(grade);
    }
    return res.status(403).json({ error: "Forbidden" });
  }

  if (req.method === "PATCH") {
    if (!(user.role === "ADMIN" || (user.role === "TEACHER" && grade.student?.class?.teacher?.userId === user.id))) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const { value, subject } = req.body;
    const before = { value: grade.value, subject: grade.subject };
    const updated = await prisma.grade.update({ where: { id }, data: { value: value !== undefined ? Number(value) : grade.value, subject: subject || grade.subject }});
    await logActivity(user.id, "grade:update", { gradeId: id, before, after: { value: updated.value, subject: updated.subject }});
    return res.json(updated);
  }

  if (req.method === "DELETE") {
    if (!(user.role === "ADMIN" || (user.role === "TEACHER" && grade.student?.class?.teacher?.userId === user.id))) {
      return res.status(403).json({ error: "Forbidden" });
    }
    await prisma.grade.delete({ where: { id }});
    await logActivity(user.id, "grade:delete", { gradeId: id });
    return res.status(204).end();
  }

  return res.status(405).end();
}
