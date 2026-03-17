// scripts/seedPosts.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const author = await prisma.user.findFirst();

  if (!author) {
    console.log("No user found, please run seed.js first");
    return;
  }

  // Create default article
  await prisma.post.create({
    data: {
      category: "STARTY",
      title: "IV Czasówka Rowerowa pod Ostrą",
      content: `IV Czasówka Rowerowa pod Ostrą odbędzie się 27 lipca 2025 roku, oferując 6,5 km wspinaczki ze stadionu w Starej Wsi, z 331 m przewyższenia i średnim nachyleniem powyżej 5%. To popularne kolarskie wyzwanie organizowane przez Limanowską Grupę Rowerową, z czasami najlepszych wynoszącymi ok. 14,5 minuty.<br/><br/>
<b>Najważniejsze informacje o imprezie:</b>
<ul>
  <li><b>Termin:</b> 27 lipca 2025 r. (niedziela) Limanowa.in.</li>
  <li><b>Miejsce startu:</b> Stadion sportowy w Starej Wsi.</li>
  <li><b>Trasa:</b> 6,5 km, wjazd na przełęcz pod Ostrą, 331 m przewyższenia, średnio ponad 5% nachylenia.</li>
  <li><b>Organizator:</b> Limanowska Grupa Rowerowa. </li>
</ul><br/>
Wydarzenie przyciąga pasjonatów kolarstwa szosowego i górskiego, oferując rywalizację w malowniczych okolicach Limanowej Facebook. Warto odróżnić ją od samochodowego Wyścigu Górskiego Limanowa (GSMP), który odbywa się na tej samej trasie.`,
      authorId: author.id,
    },
  });

  console.log("Stworzono domyślny post w sekcji STARTY.");
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
