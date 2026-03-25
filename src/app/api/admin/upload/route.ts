import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import slugify from 'slugify';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
        }

        // Always fetch authorId fresh from DB to avoid stale JWT token issues
        const sessionUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });
        if (!sessionUser) {
            return NextResponse.json({ error: 'Użytkownik nie znaleziony w bazie' }, { status: 403 });
        }
        const authorId = sessionUser.id;

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
        let gpxUrl: string | null = null;
        const imageUrls: string[] = [];
        
        // GPX stats
        let distance: number | null = null;
        let elevation: number | null = null;
        let routeData: any = null;

        // Dynamic import GpxParser for processing GPX files
        const GpxParser = (await import('gpxparser')).default || require('gpxparser');

        // 2. Zapisywanie plików
        for (const file of mediaFiles) {
            const buffer = Buffer.from(await file.arrayBuffer());
            // Proste usuwanie niebezpiecznych znaków z nazwy pliku
            const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
            const filePath = path.join(absoluteDir, safeName);

            // Zawsze Unixowy styl ścieżek, powiązany z zewnętrznym URL lokalnym (na produkcji z podpiętą domeną)
            const absoluteNetworkUrl = `${mediaBaseUrl}${relativeDir}/${safeName}`;

            await fs.writeFile(filePath, buffer);

            if (file.type.startsWith('video/') || safeName.toLowerCase().endsWith('.mp4')) {
                videoUrl = absoluteNetworkUrl; // Prisma wspiera jeden videoUrl dla posta wg Schema
            } else if (file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(safeName)) {
                imageUrls.push(absoluteNetworkUrl);
            } else if (safeName.toLowerCase().endsWith('.gpx')) {
                gpxUrl = absoluteNetworkUrl;
                
                try {
                    const gpxText = buffer.toString('utf-8');
                    const gpx = new GpxParser();
                    gpx.parse(gpxText);
                    
                    if (gpx.tracks && gpx.tracks.length > 0) {
                        const track = gpx.tracks[0];
                        distance = parseFloat((track.distance.total / 1000).toFixed(2)); // in km
                        elevation = parseFloat((track.elevation.pos).toFixed(0)); // positive elevation gain in meters
                        
                        // Extract points (lat, lon, ele) for drawing on map
                        routeData = track.points.map((p: any) => [p.lat, p.lon, p.ele || 0]);
                    }
                } catch (err) {
                    console.error("Error parsing GPX file:", err);
                }
            }
        }

        // 3. Create or UPDATE Post in Supabase via Prisma
        const postId = formData.get('postId') as string | null;
        let post;

        if (postId) {
            // UPDATE existing post — keep old media unless new files were uploaded
            const existing = await prisma.post.findUnique({ where: { id: postId } });
            post = await prisma.post.update({
                where: { id: postId },
                data: {
                    title,
                    content,
                    category,
                    videoUrl: videoUrl ?? existing?.videoUrl ?? null,
                    imageUrls: imageUrls.length > 0 ? imageUrls : (existing?.imageUrls ?? []),
                    gpxUrl: gpxUrl ?? existing?.gpxUrl ?? null,
                    distance: distance ?? existing?.distance ?? null,
                    elevation: elevation ?? existing?.elevation ?? null,
                    routeData: routeData ?? existing?.routeData ?? null,
                },
            });
        } else {
            // CREATE new post
            post = await prisma.post.create({
                data: {
                    title,
                    slug: uniqueSlug,
                    content,
                    category,
                    authorId,
                    videoUrl,
                    imageUrls,
                    gpxUrl,
                    distance,
                    elevation,
                    routeData,
                },
            });
        }

        // Invalidate all listing pages so thumbnails update immediately
        revalidatePath('/starty');
        revalidatePath('/wydarzenia');
        revalidatePath('/trasy');
        revalidatePath('/media');
        revalidatePath('/');

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
