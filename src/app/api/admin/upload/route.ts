import { NextResponse } from 'next/server';

// Polyfill dla starych wersji Node.js < 18.17 (na których potyka się Next.js przy revalidatePaths lub URLach)
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

        // Always fetch authorId fresh from DB to avoid stale JWT token issues
        const sessionUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });
        if (!sessionUser) {
            return NextResponse.json({ error: 'Użytkownik nie znaleziony w bazie' }, { status: 403 });
        }
        const authorId = sessionUser.id;
        
        // --- SEKCJA DEBUGOWANIA UNDICI ---
        console.log("-----------------------------------------");
        console.log("[DEBUG] Rozpoczęto wysyłanie formularza");
        
        const contentType = req.headers.get('content-type') || '';
        console.log("[DEBUG] Nagłówek Content-Type:", contentType);
        
        if (!contentType.includes('boundary=')) {
            console.warn("[WARN] OSTRZEŻENIE: Brak 'boundary' w nagłówku Content-Type!");
        } else {
            console.log("[DEBUG] Znaleziono boundary:", contentType.split('boundary=')[1]);
        }
        
        // Zbuforowanie całego ładunku do ArrayBuffer pozwala nam fizycznie zmierzyć
        // czy przeglądarka podesłała kompletne pliki czy urwała połącznie
        // Uwaga: po odczytaniu ciała (body), zrobimy kopię Requestu, by nie wyleciał błąd "body is disturbed"
        let rawBodyBuffer: Buffer;
        try {
            rawBodyBuffer = Buffer.from(await req.arrayBuffer());
            console.log("[DEBUG] Pomyślnie pobrano w całości Body. Rozmiar:", (rawBodyBuffer.byteLength / 1024 / 1024).toFixed(3), "MB");
        } catch (bufferErr) {
            console.error("[DEBUG-CRITICAL] Błąd odczytu surowego ArrayBuffer:", bufferErr);
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
            console.log("[DEBUG] Uruchamianie autorskiego parsera wielomegabajtowego...");
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
            console.log("[DEBUG] Custom Parser wykonał zadanie bezbłędnie!");
        } catch (parserErr: any) {
            console.error("[!!! BŁĄD CUSTOM PARSERA !!!]", parserErr);
            return NextResponse.json({ error: 'Błąd ramy autorskiego parsera' }, { status: 500 });
        }

        // ── Zod Validation ──
        const validation = postSchema.safeParse({ title, content, category });
        if (!validation.success) {
            const msg = validation.error.issues?.[0]?.message || 'Nieprawidłowe dane formularza';
            console.warn("[SECURITY] Zod validation failed:", msg);
            return NextResponse.json({ error: msg }, { status: 400 });
        }
        title = validation.data.title;
        content = validation.data.content;
        category = validation.data.category;

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
        console.log(`[DEBUG] Rozpoczynam zapis: znaleziono ${mediaFiles.length} plików w przysłanym żądaniu.`);
        for (const file of mediaFiles) {
            const buffer = file.data;
            const originalName = file.filename || "nieznany_plik";
            
            // Proste usuwanie niebezpiecznych znaków z nazwy pliku
            const safeName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
            const filePath = path.join(absoluteDir, safeName);
            console.log(`[DEBUG] Zapisywanie pliku: ${originalName} -> ${safeName} (Rozmiar: ${buffer.length} bajtów, Typ: ${file.contentType})`);

            // Zapisujemy TYLKO relatywną ścieżkę (dynamiczne IP dorysuje frontend)
            const relativeNetworkUrl = `${relativeDir}/${safeName}`;

            await fs.writeFile(filePath, buffer);

            const isGpx = safeName.toLowerCase().endsWith('.gpx') || file.contentType.includes('gpx');
            const isVideo = file.contentType.startsWith('video/') || safeName.toLowerCase().endsWith('.mp4');
            const isImage = file.contentType.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(safeName);

            if (isVideo) {
                videoUrl = relativeNetworkUrl; 
                console.log(`[DEBUG] Zaklasyfikowano jako VIDEO: ${videoUrl}`);
            } else if (isImage) {
                imageUrls.push(relativeNetworkUrl);
                console.log(`[DEBUG] Zaklasyfikowano jako ZDJĘCIE: ${relativeNetworkUrl}`);
            } else if (isGpx) {
                gpxUrl = relativeNetworkUrl;
                console.log(`[DEBUG] Zaklasyfikowano jako MAPA GPX: ${gpxUrl}. Rozpoczynam parsowanie gpx...`);
                
                try {
                    const gpxText = buffer.toString('utf-8');
                    const gpx = new GpxParser();
                    gpx.parse(gpxText);
                    
                    console.log(`[DEBUG] GPX Parser odczytał ścieżki: ${gpx.tracks?.length || 0}`);
                    
                    if (gpx.tracks && gpx.tracks.length > 0) {
                        const track = gpx.tracks[0];
                        distance = track.distance?.total != null ? parseFloat((track.distance.total / 1000).toFixed(2)) : 0; // in km
                        elevation = track.elevation?.pos != null ? parseFloat((track.elevation.pos).toFixed(0)) : 0; // positive elevation gain in meters
                        
                        console.log(`[DEBUG] Obliczono z GPX - Dystans: ${distance} km, Przewyższenie: ${elevation} m+`);
                        
                        // Extract points (lat, lon, ele) for drawing on map
                        routeData = track.points.map((p: any) => [p.lat, p.lon, p.ele || 0]);
                        console.log(`[DEBUG] Ekstrakcja punktów trasy (RouteData) ukończona pomyślnie. Zliczono: ${routeData.length} punktów.`);
                    } else {
                        console.warn(`[WARN-GPX] Plik GPX nie zawiera dających się odczytać tras (sekcja <trk> wewnątrz <gpx> XML).`);
                    }
                } catch (err) {
                    console.error("[ERROR-GPX] Krytyczny błąd parsowania pliku GPX przez bibliotekę gpxparser:", err);
                }
            } else {
                console.log(`[DEBUG] Zaklasyfikowano jako INNY plik: (Nazwa: ${safeName}, Rozmiar: ${buffer.length})`);
            }
        }

        // 3. Create or UPDATE Post in Supabase via Prisma
        let post;

        if (postId) {
            // UPDATE existing post 
            const existing = await prisma.post.findUnique({ where: { id: postId } });
            
            // --- Inteligentne filtrowanie zachowanych mediów (odporne na IP) ---
            const normalize = (u: string) => {
                const match = u.match(/https?:\/\/[^\/]+(\/articles\/.+)/i);
                return match ? match[1] : u;
            };

            const normalizedRetained = retainedMedia.map(normalize);

            // Połączenie zachowanych starych zdjęć (relatywnych z bazy) z nowowgranymi
            const existingImagesToKeep = (existing?.imageUrls ?? []).filter(url => 
                normalizedRetained.includes(normalize(url))
            );
            const finalImageUrls = [...existingImagesToKeep, ...imageUrls];

            // Weryfikacja czy video/gpx zostały zachowane (porównujemy tylko ścieżki relatywne)
            const keepVideo = existing?.videoUrl && normalizedRetained.includes(normalize(existing.videoUrl));
            const keepGpx = existing?.gpxUrl && normalizedRetained.includes(normalize(existing.gpxUrl));

            post = await prisma.post.update({
                where: { id: postId },
                data: {
                    title,
                    content,
                    category,
                    videoUrl: videoUrl ?? (keepVideo ? existing?.videoUrl : null),
                    imageUrls: finalImageUrls,
                    gpxUrl: gpxUrl ?? (keepGpx ? existing?.gpxUrl : null),
                    distance: distance ?? (keepGpx ? existing?.distance : null),
                    elevation: elevation ?? (keepGpx ? existing?.elevation : null),
                    routeData: routeData ?? (keepGpx ? existing?.routeData : null),
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
        console.log(`[DEBUG] Artykuł zapisany w bazie! ID: ${post.id}. Revalidacja cache...`);
        try {
            revalidatePath('/starty');
            revalidatePath('/wydarzenia');
            revalidatePath('/trasy');
            revalidatePath('/media');
            revalidatePath('/');
            console.log(`[DEBUG] Revalidacja cache zakończona sukcesem.`);
        } catch (revError) {
            console.warn(`[WARN] Revalidacja zakończon błędem, ignoruję:`, revError);
        }

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
