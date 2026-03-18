"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import slugify from "slugify";

export async function savePost(formData: FormData, postId?: string) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as any).id) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as "MEDIA" | "STARTY" | "WYDARZENIA" | "INNE";
  const gpxUrl = formData.get("gpxUrl") as string;

  let videoUrl = formData.get("videoUrl") as string | undefined;
  if (!videoUrl) videoUrl = undefined;

  // Handle local MP4 Upload saving to public/media
  const videoFile = formData.get("videoFile") as File | null;
  if (videoFile && videoFile.size > 0) {
    const buffer = Buffer.from(await videoFile.arrayBuffer());
    const relativePath = `/media/${Date.now()}-${videoFile.name.replace(/\s+/g, '-')}`;
    const uploadDir = path.join(process.cwd(), "public/media");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(path.join(process.cwd(), "public", relativePath), buffer);
    videoUrl = relativePath;
  }

  if (postId) {
    await prisma.post.update({
      where: { id: postId },
      data: { title, content, category, gpxUrl, videoUrl: videoUrl ?? null }
    });
  } else {
    const baseSlug = slugify(title, { lower: true, strict: true, locale: 'pl' });
    const uniqueSlug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;

    await prisma.post.create({
      data: {
        title,
        slug: uniqueSlug,
        content,
        category,
        gpxUrl,
        videoUrl,
        authorId: (session.user as any).id
      }
    });
  }

  revalidatePath("/starty");
  revalidatePath("/media");
  revalidatePath("/wydarzenia");
  revalidatePath("/admin");
}

export async function deletePost(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as any).id) {
    throw new Error("Unauthorized");
  }

  await prisma.post.delete({ where: { id: postId } });

  revalidatePath("/starty");
  revalidatePath("/media");
  revalidatePath("/wydarzenia");
  revalidatePath("/admin");
}
