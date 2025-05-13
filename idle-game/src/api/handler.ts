import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function handleCharacterRequest(path: string, params: any = {}) {
    try {
        switch (path) {
            case '/current':
                if (!params.currentCharacterId) {
                    const defaultCharacter = await prisma.character.findFirst({
                        where: { name: 'User' }
                    });
                    if (defaultCharacter) {
                        return defaultCharacter;
                    }
                    throw new Error('No default character found');
                }
                return prisma.character.findUnique({
                    where: { id: params.currentCharacterId }
                });

            case '/default':
                return prisma.character.findFirst({
                    where: { name: 'User' }
                });

            default:
                if (path.startsWith('/')) {
                    const id = parseInt(path.slice(1));
                    if (isNaN(id)) {
                        throw new Error('Invalid character ID');
                    }
                    const character = await prisma.character.findUnique({
                        where: { id }
                    });
                    if (!character) {
                        throw new Error('Character not found');
                    }
                    return character;
                }
                throw new Error('Invalid path');
        }
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
} 