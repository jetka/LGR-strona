import { NextResponse } from 'next/server';

// Polyfill dla starych wersji Node.js < 18.17 
if (typeof URL.canParse !== 'function') {
    (URL as any).canParse = function(url: string) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };
}

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { postSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import slugify from 'slugify';

interface ParsedFile {
    name: string;
    filename: string;
    contentType: string;
    data: Buffer;
}

function parseMultipart(buffer: Buffer, boundary: string) {
    const boundaryBuffer = Buffer.from(`--${boundary}`);
    const parts = [];
    let offset = 0;

    while (true) {
        let startIndex = buffer.indexOf(boundaryBuffer, offset);
        if (startIndex === -1) break;

        let partStart = startIndex + boundaryBuffer.length;
        if (partStart + 2 <= buffer.length && buffer[partStart] === 45 && buffer[partStart + 1] === 45) break; 
        if (buffer[partStart] === 13 && buffer[partStart + 1] === 10) partStart += 2;

        let endIndex = buffer.indexOf(boundaryBuffer, partStart);
        if (endIndex === -1) break;

        let partEnd = endIndex;
        if (buffer[endIndex - 2] === 13 && buffer[endIndex - 1] === 10) partEnd -= 2;

        const partBuffer = buffer.subarray(partStart, partEnd);
        const headerEnd = partBuffer.indexOf(Buffer.from('\r\n\r\n'));

        if (headerEnd !== -1) {
            const headersStr = partBuffer.subarray(0, headerEnd).toString('utf-8');
            const dataBuffer = partBuffer.subarray(headerEnd + 4);

            const nameMatch = headersStr.match(/name="([^"]+)"/);
            const filenameMatch = headersStr.match(/filename="([^"]+)"/);
            
            parts.push({
                name: nameMatch ? nameMatch[1] : null,
                filename: filenameMatch ? filenameMatch[1] : null,
                contentType: headersStr.match(/Content-Type:\s*([^\r\n]+)/i)?.[1] || 'text/plain',
                data: dataBuffer
            });
        }
        offset = endIndex;
    }
    return parts;
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
        }

        const sessionUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });
        if (!sessionUser) {
            return NextResponse.json({ error: 'Użytkownik nie znaleziony w bazie' }, { status: 403 });
        }
        const authorId = sessionUser.id;
        
        const contentType = req.headers.get('content-type') || '';
        let rawBodyBuffer: Buffer;
        try {
            rawBodyBuffer = Buffer.from(await req.arrayBuffer());
        } catch (bufferErr) {
            return NextResponse.json({ error: 'Nie udało się odczytać strumienia formularza' }, { status: 500 });
        }

        const boundaryOb = contentType.split('boundary=')[1];
        if (!boundaryOb) {
            return NextResponse.json({ error: 'Brak klucza boundary' }, { status: 400 });
        }
        const boundary = boundaryOb.replace(/^["']|["']$/g, '');

        let title = '';
        let content = '';
        let category: any = '';
        let postId: string | null = null;
        const mediaFiles: ParsedFile[] = [];
        const retainedMedia: string[] = [];

        try {
            const parts = parseMultipart(rawBodyBuffer, boundary);
            for (const part of parts) {
                if (!part.name) continue;
                if (part.filename) {
                    if (part.name.startsWith('media_') || part.name === 'media') {
                        mediaFiles.push({
                            name: part.name,
                            filename: part.filename,
                            contentType: part.contentType,
                            data: part.data
                        });
                    }
                } else {
                    const val = part.data.toString('utf-8');
                    if (part.name === 'title') title = val;
                    if (part.name === 'content') content = val;
                    if (part.name === 'category') category = val;
                    if (part.name === 'postId') postId = val;
                    if (part.name === 'retainedMedia') retainedMedia.push(val);
                }
            }
        } catch (parserErr: any) {
            return NextResponse.json({ error: 'Błąd ramy autorskiego parsera' }, { status: 500 });
        }

        const validation = postSchema.safeParse({ title, content, category });
        if (!validation.success) {
            const msg = validation.error.issues?.[0]?.message || 'Nieprawidłowe dane formularza';
            return NextResponse.json({ error: msg }, { status: 400 });
        }
        title = validation.data.title;
        content = validation.data.content;
        category = validation.data.category;

        const today = new Date().toISOString().split('T')[0];
        const baseSlug = slugify(title, { lower: true, strict: true, locale: 'pl' });
        const uniqueSlug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
        const dirName = `${today}-${baseSlug}`;
        const mediaRoot = process.env.MEDIA_ROOT_PATH || 'C:/vibeCoding/LGR strona/lgr-media-server';
        const relativeDir = `/articles/${dirName}`;
        const absoluteDir = path.join(mediaRoot, 'articles', dirName);

        await fs.mkdir(absoluteDir, { recursive: true });

        let videoUrl: string | null = null;
        let gpxUrl: string | null = null;
        const imageUrls: string[] = [];
        let distance: number | null = null;
        let elevation: number | null = null;
        let routeData: any = null;

        const GpxParser = (await import('gpxparser')).default || require('gpxparser');

        for (const file of mediaFiles) {
            const buffer = file.data;
            const originalName = file.filename || "nieznany_plik";
            const safeName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
            const filePath = path.join(absoluteDir, safeName);
            const relativeNetworkUrl = `${relativeDir}/${safeName}`;

            await fs.writeFile(filePath, buffer);

            const isGpx = safeName.toLowerCase().endsWith('.gpx') || file.contentType.includes('gpx');
            const isVideo = file.contentType.startsWith('video/') || safeName.toLowerCase().endsWith('.mp4');
            const isImage = file.contentType.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(safeName);

            if (isVideo) {
                videoUrl = relativeNetworkUrl; 
            } else if (isImage) {
                imageUrls.push(relativeNetworkUrl);
            } else if (isGpx) {
                gpxUrl = relativeNetworkUrl;
                try {
                    const gpxText = buffer.toString('utf-8');
                    const gpx = new GpxParser();
                    gpx.parse(gpxText);
                    if (gpx.tracks && gpx.tracks.length > 0) {
                        const track = gpx.tracks[0];
                        distance = track.distance?.total != null ? parseFloat((track.distance.total / 1000).toFixed(2)) : 0;
                        elevation = track.elevation?.pos != null ? parseFloat((track.elevation.pos).toFixed(0)) : 0;
                        routeData = track.points.map((p: any) => [p.lat, p.lon, p.ele || 0]);
                    }
                } catch (err) {
                    // Fail silently
                }
            }
        }

        let post;
        if (postId) {
            const existing = await prisma.post.findUnique({ where: { id: postId } });
            const normalize = (u: string) => {
                const match = u.match(/https?:\/\/[^\/]+(\/articles\/.+)/i);
                return match ? match[1] : u;
            };
            const normalizedRetained = retainedMedia.map(normalize);
            const existingImagesToKeep = (existing?.imageUrls ?? []).filter(url => 
                normalizedRetained.includes(normalize(url))
            );
            const finalImageUrls = [...existingImagesToKeep, ...imageUrls];
            const keepVideo = existing?.videoUrl && normalizedRetained.includes(normalize(existing.videoUrl));
            const keepGpx = existing?.gpxUrl && normalizedRetained.includes(normalize(existing.gpxUrl));

            post = await prisma.post.update({
                where: { id: postId },
                data: {
                    title, content, category,
                    videoUrl: videoUrl ?? (keepVideo ? existing?.videoUrl : null),
                    imageUrls: finalImageUrls,
                    gpxUrl: gpxUrl ?? (keepGpx ? existing?.gpxUrl : null),
                    distance: distance ?? (keepGpx ? existing?.distance : null),
                    elevation: elevation ?? (keepGpx ? existing?.elevation : null),
                    routeData: routeData ?? (keepGpx ? existing?.routeData : null),
                },
            });
        } else {
            post = await prisma.post.create({
                data: {
                    title, slug: uniqueSlug, content, category, authorId,
                    videoUrl, imageUrls, gpxUrl, distance, elevation, routeData,
                },
            });
        }

        try {
            revalidatePath('/starty');
            revalidatePath('/wydarzenia');
            revalidatePath('/trasy');
            revalidatePath('/media');
            revalidatePath('/');
        } catch (revError) {
            // Fail silently
        }

        return NextResponse.json({ success: true, post });

    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Wystąpił krytyczny błąd' }, { status: 500 });
    }
}
