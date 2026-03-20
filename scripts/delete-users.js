const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const emailsToDelete = ['m6474230@gamil.com', 'mrgangaaaaa5@gamil.com', 'm6474230@gmail.com']; // Found three similar ones
    
    console.log(`Attempting to delete users with emails: ${emailsToDelete.join(', ')}`);

    for (const email of emailsToDelete) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            console.log(`Found user: ${email} (ID: ${user.id}). Deleting...`);
            
            // Delete related records to maintain referential integrity
            await prisma.resumeScore.deleteMany({ where: { userId: user.id } });
            await prisma.jobMatch.deleteMany({ where: { userId: user.id } });
            await prisma.skillGap.deleteMany({ where: { userId: user.id } });
            await prisma.mockInterview.deleteMany({ where: { userId: user.id } });
            await prisma.portfolio.deleteMany({ where: { userId: user.id } });
            
            // Delete user
            await prisma.user.delete({ where: { id: user.id } });
            console.log(`Successfully deleted ${email} and all related data.`);
        } else {
            console.log(`User ${email} not found.`);
        }
    }
}

main()
    .catch((e) => {
         console.error(e)
         process.exit(1)
    })
    .finally(async () => {
         await prisma.$disconnect()
    })
