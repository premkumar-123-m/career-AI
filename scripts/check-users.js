const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    fs.writeFileSync('scripts/users_output.json', JSON.stringify(users, null, 2));
    console.log('Users written to scripts/users_output.json');
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
