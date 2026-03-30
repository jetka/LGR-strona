import { prisma } from "@/lib/prisma";
import PostGrid from "@/components/PostGrid";

export const revalidate = 0;

export default async function StartyPage() {
  const posts = await prisma.post.findMany({
    where: { category: "STARTY" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PostGrid
      posts={posts}
      sectionTitle="Starty"
      sectionSubtitle="Limanowska Grupa Rowerowa"
      basePath="starty"
      emptyMessage="Brak wpisów startowych — dodaj artykuł przez panel admina!"
    />
  );
}
