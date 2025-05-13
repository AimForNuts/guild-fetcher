const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupDefaultCharacter() {
    try {
        // Check if the default character already exists
        const existingCharacter = await prisma.character.findFirst({
            where: {
                name: 'User'
            }
        });

        if (!existingCharacter) {
            // Create the default character
            const defaultCharacter = await prisma.character.create({
                data: {
                    name: 'User',
                    woodcutting_level: 1,
                    woodcutting_xp: 0
                }
            });
            console.log('Default character created:', defaultCharacter);
        } else {
            console.log('Default character already exists:', existingCharacter);
        }
    } catch (error) {
        console.error('Error setting up default character:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the setup
setupDefaultCharacter(); 