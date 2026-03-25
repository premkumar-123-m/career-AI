const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    console.log("Successfully connected to DB! User count:", userCount);
  } catch (err) {
    console.error("Failed to connect or query DB:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
