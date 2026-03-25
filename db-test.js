const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const GpxParser = require('gpxparser');

const prisma = new PrismaClient();

async function main() {
    console.log("Searching for admin...");
    const user = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
        orderBy: { createdAt: 'desc' }
    });

    if (!user) {
        console.error("No admin user found! Cannot create post.");
        return;
    }

    console.log(`Found author: ${user.email}`);

    const gpxFilePath = 'C:/vibeCoding/LGR strona/lgr-media-server/articles/2026-03-25-trasa test/2025-07-16_2410366609_RPT Limanowa - Zabawa.gpx';
    const gpxData = fs.readFileSync(gpxFilePath, 'utf-8');
    
    const gpx = new GpxParser();
    gpx.parse(gpxData);
    
    const track = gpx.tracks[0];
    const distance = parseFloat((track.distance.total / 1000).toFixed(2));
    const elevation = parseFloat((track.elevation.pos || 0).toFixed(0));
    const routeData = track.points.map(p => [p.lat, p.lon, p.ele || 0]);

    console.log(`Parsed GPX: ${distance} km, ${elevation} m+, ${routeData.length} points.`);

    const post = await prisma.post.create({
        data: {
            title: 'Testowa Trasa: RPT Limanowa - Zabawa',
            slug: 'trasa-rpt-limanowa-zabawa-gpx',
            content: '<p>Oto testowy artykuł dla nowej sekcji Tras. Znajdziesz tutaj zaawansowany podgląd interaktywnej mapy ze statystykami pobranymi bezpośrednio z pliku GPX. Przetestuj działanie "Hero Map" oraz paneli ze szczegółowymi informacjami.</p>',
            category: 'INNE', // INNE maps to /trasy
            authorId: user.id,
            gpxUrl: 'http://localhost:8080/articles/2026-03-25-trasa test/2025-07-16_2410366609_RPT Limanowa - Zabawa.gpx',
            imageUrls: ['http://localhost:8080/articles/2026-03-25-trasa test/651005253_934486732671719_3895271009930800358_n.jpg'],
            distance: distance,
            elevation: elevation,
            routeData: routeData,
            published: true
        }
    });

    console.log("Created successfully! ID:", post.id);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
