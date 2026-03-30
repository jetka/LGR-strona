import { prisma } from "@/lib/prisma";
import PostGrid from "@/components/PostGrid";

export const revalidate = 0;

export default async function WydarzeniaPage() {
  const posts = await prisma.post.findMany({
    where: { category: "WYDARZENIA" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PostGrid
      posts={posts}
      sectionTitle="Wydarzenia"
      sectionSubtitle="Limanowska Grupa Rowerowa"
      basePath="wydarzenia"
      emptyMessage="Brak nadchodzących wydarzeń — sprawdź wkrótce!"
    />
  );
}
