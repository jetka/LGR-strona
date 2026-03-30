import { prisma } from "@/lib/prisma";
import ArticleView from "@/components/ArticleView";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function WydarzeniaArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await prisma.post.findUnique({ where: { slug } });

    if (!post || post.category !== "WYDARZENIA") notFound();

    return <ArticleView post={post} />;
}
