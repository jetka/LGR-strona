import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';
import slugify from 'slugify';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
        }
        const authorId = (session.user as any).id;

        // Przetwarzanie multipart/form-data
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const category = formData.get('category') as any;
        const mediaFiles = formData.getAll('media') as File[]; // wszystkie przesłane wspólnie pliki

        if (!title || !content || !category) {
            return NextResponse.json({ error: 'Brak wymaganych pól tekstowych' }, { status: 400 });
        }

        // 1. Generowanie ścieżek
        const today = new Date().toISOString().split('T')[0];
        const baseSlug = slugify(title, { lower: true, strict: true, locale: 'pl' });
        const uniqueSlug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
        const dirName = `${today}-${baseSlug}`;
        const mediaRoot = process.env.MEDIA_ROOT_PATH || 'C:/vibeCoding/LGR strona/lgr-media-server';
        const mediaBaseUrl = process.env.MEDIA_BASE_URL || 'http://localhost:8080';
        const relativeDir = `/articles/${dirName}`;
        const absoluteDir = path.join(mediaRoot, 'articles', dirName);

        // Utworzenie folderów zewnętrznego Storage
        await fs.mkdir(absoluteDir, { recursive: true });

        let videoUrl: string | null = null;
        const imageUrls: string[] = [];

        // 2. Zapisywanie plików
        for (const file of mediaFiles) {
            const buffer = Buffer.from(await file.arrayBuffer());
            // Proste usuwanie niebezpiecznych znaków z nazwy pliku
            const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
            const filePath = path.join(absoluteDir, safeName);

            // Zawsze Unixowy styl ścieżek, powiązany z zewnętrznym URL lokalnym (na produkcji z podpiętą domeną)
            const absoluteNetworkUrl = `${mediaBaseUrl}${relativeDir}/${safeName}`;

            await fs.writeFile(filePath, buffer);

            if (file.type.startsWith('video/')) {
                videoUrl = absoluteNetworkUrl; // Prisma wspiera jeden videoUrl dla posta wg Schema
            } else if (file.type.startsWith('image/')) {
                imageUrls.push(absoluteNetworkUrl);
            }
        }

        // 3. Utworzenie rekordu Post'a w Supabase poprzez Prisma ORM
        const post = await prisma.post.create({
            data: {
                title,
                slug: uniqueSlug,
                content,
                category,
                authorId,
                videoUrl,
                imageUrls,
            },
        });

        return NextResponse.json({
            success: true,
            post,
            mediaPaths: [...imageUrls, videoUrl].filter(Boolean)
        });

    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Wystąpił krytyczny błąd: ' + error.message }, { status: 500 });
    }
}
