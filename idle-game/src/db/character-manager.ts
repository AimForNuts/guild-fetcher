import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let currentCharacterId: number | null = null;

export async function getCurrentCharacter() {
    try {
        const response = await fetch('/api/character/current', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currentCharacterId })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch character');
        }

        const data = await response.json();
        if (data.id) {
            currentCharacterId = data.id;
        }
        return data;
    } catch (error) {
        console.error('Error in getCurrentCharacter:', error);
        throw error;
    }
}

export async function setCurrentCharacter(id: number) {
    try {
        const response = await fetch(`/api/character/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch character');
        }

        const data = await response.json();
        currentCharacterId = id;
        return data;
    } catch (error) {
        console.error('Error in setCurrentCharacter:', error);
        throw error;
    }
}

export async function getDefaultCharacter() {
    try {
        const response = await fetch('/api/character/default', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch default character');
        }

        return response.json();
    } catch (error) {
        console.error('Error in getDefaultCharacter:', error);
        throw error;
    }
}

// Make sure to disconnect Prisma when your application shuts down
export async function disconnect() {
    await prisma.$disconnect();
} 