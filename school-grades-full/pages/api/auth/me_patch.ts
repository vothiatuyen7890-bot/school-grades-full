import type { NextApiRequest, NextApiResponse } from "next";
import { getUserFromReq } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { logActivity } from "../../../lib/activity";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const user = await getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "PATCH") {
    const { name, password } = req.body;
    const data:any = {};
    if (name) data.name = name;
    if (password) data.password = await bcrypt.hash(password, 10);
    const updated = await prisma.user.update({ where: { id: user.id }, data });
    await logActivity(user.id, "user:update_profile", { changed: Object.keys(data) });
    return res.json({ id: updated.id, email: updated.email, name: updated.name, role: updated.role });
  }

  return res.status(405).end();
}
