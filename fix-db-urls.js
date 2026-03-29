const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixMediaUrls() {
  const oldHost = 'localhost:8080';
  const newHost = '192.168.1.32:8080';

  try {
    const posts = await prisma.post.findMany();
    
    for (const post of posts) {
      let updated = false;
      const data = {};

      if (post.imageUrls && post.imageUrls.some(u => u.includes(oldHost))) {
        data.imageUrls = post.imageUrls.map(u => u.replace(oldHost, newHost));
        updated = true;
      }

      if (post.videoUrl && post.videoUrl.includes(oldHost)) {
        data.videoUrl = post.videoUrl.replace(oldHost, newHost);
        updated = true;
      }

      if (post.gpxUrl && post.gpxUrl.includes(oldHost)) {
        data.gpxUrl = post.gpxUrl.replace(oldHost, newHost);
        updated = true;
      }

      if (updated) {
        await prisma.post.update({
          where: { id: post.id },
          data
        });
        console.log(`Zaktualizowano: ${post.title}`);
      }
    }
    
    console.log("Gotowe! Wszystkie linki w bazie danych prowadzą teraz na IP komputera.");
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

fixMediaUrls();
