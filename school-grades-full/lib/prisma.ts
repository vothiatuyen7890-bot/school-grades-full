import { PrismaClient } from "@prisma/client";

declare global {
  // allow global prisma in dev to avoid hot-reload creating many clients
  var prisma: PrismaClient | undefined;
}

const client = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") global.prisma = client;

export default client;
