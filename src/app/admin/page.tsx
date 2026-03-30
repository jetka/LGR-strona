import { prisma } from "@/lib/prisma";
import AdminClient from "./client";

export const revalidate = 0; // Don't cache admin page initial data

export default async function AdminDashboard() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AdminClient initialPosts={posts} />;
}
