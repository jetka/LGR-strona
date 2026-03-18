import { prisma } from "@/lib/prisma";
import MediaGrid from "@/components/MediaGrid";

export const revalidate = 60; // Regenerate page every 60 seconds

export default async function MediaPage() {
  const posts = await prisma.post.findMany({
    where: { category: "MEDIA" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full bg-transparent relative z-10">
      <MediaGrid posts={posts} />
    </div>
  );
}
