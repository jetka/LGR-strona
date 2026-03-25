const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
p.user
    .findMany({ select: { id: true, email: true, role: true } })
    .then((users) => {
        console.log("=== USERS IN DB ===");
        console.log(JSON.stringify(users, null, 2));
        p.$disconnect();
    })
    .catch((e) => { console.error(e); p.$disconnect(); });
