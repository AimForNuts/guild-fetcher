import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if default character exists
    const defaultCharacter = await prisma.character.findFirst({
      where: { name: 'User' }
    });

    if (!defaultCharacter) {
      // Create default character if it doesn't exist
      await prisma.character.create({
        data: {
          name: 'User',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
          woodcutting_level: 1,
          woodcutting_xp: 0
        }
      });
      console.log('Default character created successfully');
    } else {
      console.log('Default character already exists');
    }
  } catch (error) {
    console.error('Error ensuring default character:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 