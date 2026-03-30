import { prisma } from "@/lib/prisma";
import PostGrid from "@/components/PostGrid";

export const revalidate = 0;

export default async function TrasynPage() {
    const posts = await prisma.post.findMany({
        where: { category: "INNE" },
        orderBy: { createdAt: "desc" },
    });

    return (
        <PostGrid
            posts={posts}
            sectionTitle="Trasy"
            sectionSubtitle="Polecane szlaki rowerowe"
            basePath="trasy"
            emptyMessage="Brak opisanych tras — zajrzyj wkrótce!"
        />
    );
}
