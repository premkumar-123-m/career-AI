const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function testLogin(email, password) {
    console.log(`Testing login for ${email}...`);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.log('User not found');
        return;
    }
    if (!user.password) {
        console.log('User has no password set!');
        return;
    }
    const match = await bcrypt.compare(password, user.password);
    console.log(`Password match: ${match}`);
}

testLogin('student@example.com', 'password123')
    .finally(() => prisma.$disconnect());
