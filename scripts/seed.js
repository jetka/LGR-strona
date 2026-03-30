// scripts/seed.js (we use js for simple execution directly with node avoiding ts-node issues)
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const user = await prisma.user.upsert({
    where: { email: "lgr.limanowa@gmail.com" },
    update: {},
    create: {
      email: "lgr.limanowa@gmail.com",
      name: "Emanuel (Zarząd)",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Stworzono domyślnego użytkownika!", user.email);
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
