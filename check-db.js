const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMedia() {
  try {
    const posts = await prisma.post.findMany({
      select: {
          id: true,
          title: true,
          imageUrls: true,
          videoUrl: true,
          gpxUrl: true
      }
    });
    
    console.log("Znaleziono postów:", posts.length);
    posts.forEach(p => {
        const allMedia = [...(p.imageUrls || []), p.videoUrl, p.gpxUrl].filter(Boolean);
        const hasLocalhost = allMedia.some(m => m.includes('localhost'));
        if (hasLocalhost) {
            console.log(`[!] Post "${p.title}" (ID: ${p.id}) zawiera linki do localhost!`);
            console.log("    Media:", allMedia.filter(m => m.includes('localhost')));
        }
    });

  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

checkMedia();
