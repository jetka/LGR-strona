import { prisma } from "@/lib/prisma";
import ArticleView from "@/components/ArticleView";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function MediaArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await prisma.post.findUnique({
        where: { slug },
    });

    if (!post || post.category !== "MEDIA") {
        notFound();
    }

    return <ArticleView post={post} />;
}
