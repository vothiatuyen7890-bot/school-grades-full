import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { addActivity } from "@/lib/activity";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const auth = await requireRole(req, res, ["ADMIN"]);
    if (!auth) return; // requireRole tự trả 401

    const userId = req.query.id as string;

    if (req.method === "PATCH") {
        const { name, password, role } = req.body;

        const updated = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                password: password ? await bcrypt.hash(password, 10) : undefined,
                role
            }
        });

        await addActivity(auth.user.id, `Admin updated user ${userId}`);

        return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
        await prisma.user.delete({ where: { id: userId }});

        await addActivity(auth.user.id, `Admin deleted user ${userId}`);

        return res.status(200).json({ message: "User deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
}
