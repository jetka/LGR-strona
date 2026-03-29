const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function convertToRelativePaths() {
  try {
    const posts = await prisma.post.findMany();
    
    for (const post of posts) {
      let updated = false;
      const data = {};

      const toRelative = (url) => {
          if (!url) return url;
          // Matches http://anyhost:anyport/articles/ and returns /articles/
          const match = url.match(/https?:\/\/[^\/]+(\/articles\/.+)/i);
          if (match) {
              updated = true;
              return match[1];
          }
          return url;
      };

      if (post.imageUrls) {
          data.imageUrls = post.imageUrls.map(toRelative);
      }
      if (post.videoUrl) {
          data.videoUrl = toRelative(post.videoUrl);
      }
      if (post.gpxUrl) {
          data.gpxUrl = toRelative(post.gpxUrl);
      }

      if (updated) {
        await prisma.post.update({
          where: { id: post.id },
          data
        });
        console.log(`Przetworzono: ${post.title}`);
      }
    }
    
    console.log("Gotowe! Wszystkie linki w bazie danych są teraz RELATYWNE (np: /articles/...)");
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

convertToRelativePaths();
