import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Character {
    id: number;
    name: string;
    woodcutting_level: number;
    woodcutting_xp: number;
    created_at: Date;
    updated_at: Date;
}

export async function createCharacter(name: string): Promise<Character> {
    return prisma.character.create({
        data: {
            name,
        },
    });
}

export async function getCharacter(id: number): Promise<Character | null> {
    return prisma.character.findUnique({
        where: { id },
    });
}

export async function updateWoodcuttingStats(id: number, level: number, xp: number): Promise<Character | null> {
    return prisma.character.update({
        where: { id },
        data: {
            woodcutting_level: level,
            woodcutting_xp: xp,
        },
    });
}

export async function getAllCharacters(): Promise<Character[]> {
    return prisma.character.findMany();
}

// Make sure to disconnect Prisma when your application shuts down
export async function disconnect() {
    await prisma.$disconnect();
} 