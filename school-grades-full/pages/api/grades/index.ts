import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "change_this";

function getTokenFromReq(req: NextApiRequest) {
  const cookie = req.headers.cookie || "";
  const m = cookie.split(";").map(s => s.trim()).find(s => s.startsWith("token="));
  return m ? m.replace("token=", "") : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = getTokenFromReq(req);
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  let payload: any;
  try { payload = jwt.verify(token, JWT_SECRET); } catch(e){ return res.status(401).json({ error: "Invalid token" }); }

  if (req.method === "GET") {
    // STUDENT: only own grades. TEACHER: grades for their students. ADMIN: all grades.
    if (payload.role === "ADMIN") {
      const grades = await prisma.grade.findMany({ include: { student: { include: { user: true } } } });
      return res.json(grades);
    } else if (payload.role === "TEACHER") {
      // find teacher's classes -> students -> grades
      const teacher = await prisma.teacher.findUnique({ where: { userId: payload.userId }, include: { classes: { include: { students: { include: { grades: true, user: true } } } } } });
      if (!teacher) return res.json([]);
      const out = [];
      for (const cls of teacher.classes) {
        for (const st of cls.students) {
          for (const g of st.grades) out.push({ ...g, student: { id: st.id, user: st.user }});
        }
      }
      return res.json(out);
    } else {
      // STUDENT
      const student = await prisma.student.findUnique({ where: { userId: payload.userId }, include: { grades: true } });
      if (!student) return res.json([]);
      return res.json(student.grades);
    }
  }

  if (req.method === "POST") {
    // Only TEACHER or ADMIN can create grades
    if (!["TEACHER","ADMIN"].includes(payload.role)) return res.status(403).json({ error: "Forbidden" });
    const { studentId, subject, value } = req.body;
    const grade = await prisma.grade.create({ data: { studentId, subject, value: Number(value) }});
    return res.status(201).json(grade);
  }

  return res.status(405).end();
}
