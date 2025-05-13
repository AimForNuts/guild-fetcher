import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
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

    return NextResponse.json(character);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get character' }, { status: 500 });
  }
} 