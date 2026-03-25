const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
p.post
    .findMany({
        select: { id: true, slug: true, title: true, category: true, createdAt: true },
        orderBy: { createdAt: "asc" },
    })
    .then((rows) => {
        rows.forEach((r) =>
            console.log(`[${r.category}] ${r.title} | slug: ${r.slug} | id: ${r.id} | created: ${r.createdAt}`)
        );
        p.$disconnect();
    })
    .catch((e) => { console.error(e); p.$disconnect(); });
