import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const pwd = await bcrypt.hash("password123", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: { email: "admin@example.com", password: pwd, name: "Admin", role: "ADMIN" }
  });

  const teacherUser = await prisma.user.upsert({
    where: { email: "teacher1@example.com" },
    update: {},
    create: { email: "teacher1@example.com", password: pwd, name: "Teacher One", role: "TEACHER" }
  });

  const teacher = await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: {},
    create: { userId: teacherUser.id }
  });

  const classA = await prisma.class.upsert({
    where: { name: "Class A" },
    update: {},
    create: { name: "Class A", teacherId: teacher.id }
  });

  const studentUser = await prisma.user.upsert({
    where: { email: "student1@example.com" },
    update: {},
    create: { email: "student1@example.com", password: pwd, name: "Student One", role: "STUDENT" }
  });

  const student = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: { userId: studentUser.id, classId: classA.id }
  });

  await prisma.grade.createMany({
    data: [
      { studentId: student.id, subject: "Math", value: 8.5 },
      { studentId: student.id, subject: "Physics", value: 7.0 }
    ]
  });

  await prisma.activity.create({ data: { userId: adminUser.id, action: 'seed:initial', meta: { info: 'initial seed run' }}});
  console.log("Seeding complete");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
