// scripts/seedPosts.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const author = await prisma.user.findFirst();

  if (!author) {
    console.log("No user found, please run seed.js first");
    return;
  }

  // Create default article - rich content
  await prisma.post.create({
    data: {
      category: "STARTY",
      title: "IV Czasówka Rowerowa pod Ostrą",
      content: `<p>Już po raz czwarty miłośnicy kolarstwa zmierzą się z jednym z najbardziej charakterystycznych podjazdów w regionie. <strong>IV Czasówka Rowerowa pod Ostrą</strong> to nie tylko wyścig — to prawdziwy sprawdzian charakteru, siły nóg i mentalnej odporności na każdym z 6,5 kilometrów trasy.</p>

<p>Start zlokalizowany jest przy stadionie sportowym w Starej Wsi, skąd zawodnicy ruszają w kierunku malowniczej przełęczy. Trasa oferuje <strong>331 metrów przewyższenia</strong> przy średnim nachyleniu przekraczającym 5%, z fragmentami dochodzącymi do 9%. Najlepsi pokonują dystans w okolicach <em>14,5 minuty</em> — i właśnie te minuty są absolutnie bezlitosne.</p>

<p><strong>Kluczowe informacje:</strong></p>
<ul>
  <li><strong>Data:</strong> 27 lipca 2025 roku (niedziela)</li>
  <li><strong>Start:</strong> Stadion sportowy w Starej Wsi, godz. 10:00</li>
  <li><strong>Dystans:</strong> 6,5 km z 331 m przewyższenia</li>
  <li><strong>Organizator:</strong> Limanowska Grupa Rowerowa</li>
  <li><strong>Wpisowe:</strong> bezpłatne dla członków LGR</li>
</ul>

<p>Zawody rozgrywane są w pięknych okolicznościach przyrody Beskidu Wyspowego. Kibice mogą obserwować zmagania wzdłuż całej trasy, a na mecie każdego zawodnika czeka zasłużony odpoczynek i poczęstunek przygotowany przez ekipę LGR.</p>`,
      authorId: author.id,
    },
  });

  // Create default Media post
  await prisma.post.create({
    data: {
      category: "MEDIA",
      slug: "mtb-trip-example",
      title: "Górskie zjazdy w Limanowej - Test",
      content: "Niesamowite widoki i techniczne trasy na zboczach góry Miejskiej. Zobacz naszą relację z ostatniego wyjazdu!",
      videoUrl: "http://localhost:8080/articles/example/video.mp4",
      imageUrls: [
        "https://images.unsplash.com/photo-1544191714-334757efa91e?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=2070&auto=format&fit=crop"
      ],
      authorId: author.id,
    }
  });

  console.log("Stworzono domyślne posty w sekcji STARTY i MEDIA.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
