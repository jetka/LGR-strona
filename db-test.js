const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.vylqytvctxwanutahari:BrlGmzDlkUUAyWK2@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
    }
  }
})

async function main() {
  console.log("Testing 5432 connection...")
  try {
    const postCount = await prisma.post.count()
    console.log("5432 worked! Post count:", postCount)
  } catch (e) {
    console.log("5432 failed:", e.message)
  }

  const prisma2 = new PrismaClient({
    datasources: {
      db: {
        url: "postgresql://postgres.vylqytvctxwanutahari:BrlGmzDlkUUAyWK2@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
      }
    }
  })
  
  console.log("Testing 6543 connection...")
  try {
    const postCount2 = await prisma2.post.count()
    console.log("6543 worked! Post count:", postCount2)
  } catch (e) {
    console.log("6543 failed:", e.message)
  }

  await prisma.$disconnect()
  await prisma2.$disconnect()
}

main()
