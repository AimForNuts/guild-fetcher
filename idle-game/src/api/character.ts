import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getCharacter() {
  try {
    // Try to find the default character
    let character = await prisma.character.findFirst({
      where: { name: 'User' }
    });

    // If character doesn't exist, create it
    if (!character) {
      character = await prisma.character.create({
        data: {
          name: 'User',
          woodcutting_level: 1,
          woodcutting_xp: 0
        }
      });
    }

    return character;
  } catch (error) {
    console.error('Error in getCharacter:', error);
    throw error;
  }
}

export async function getCurrentCharacter() {
    try {
        const defaultCharacter = await prisma.character.findFirst({
            where: {
                name: 'User'
            }
        });
        
        if (!defaultCharacter) {
            throw new Error('No default character found');
        }

        return defaultCharacter;
    } catch (error) {
        console.error('Error in getCurrentCharacter:', error);
        throw error;
    }
}

export async function setCurrentCharacter(id: number) {
    try {
        const character = await prisma.character.findUnique({
            where: { id }
        });

        if (!character) {
            throw new Error('Character not found');
        }

        return character;
    } catch (error) {
        console.error('Error in setCurrentCharacter:', error);
        throw error;
    }
}

export async function getDefaultCharacter() {
    try {
        return prisma.character.findFirst({
            where: {
                name: 'User'
            }
        });
    } catch (error) {
        console.error('Error in getDefaultCharacter:', error);
        throw error;
    }
} 