import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import express from 'express';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Ensure default character exists
async function ensureDefaultCharacter() {
  try {
    const defaultCharacter = await prisma.character.findFirst({
      where: { name: 'User' }
    });

    if (!defaultCharacter) {
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
  }
}

// API routes
app.post('/api/character/current', async (req, res) => {
  try {
    const { currentCharacterId } = req.body;
    let character;

    if (!currentCharacterId) {
      character = await prisma.character.findFirst({
        where: { name: 'User' }
      });
      if (!character) {
        throw new Error('No default character found');
      }
    } else {
      character = await prisma.character.findUnique({
        where: { id: currentCharacterId }
      });
      if (!character) {
        throw new Error('Character not found');
      }
    }

    res.json(character);
  } catch (error) {
    console.error('Error in /api/character/current:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/character/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const character = await prisma.character.findUnique({
      where: { id }
    });

    if (!character) {
      throw new Error('Character not found');
    }

    res.json(character);
  } catch (error) {
    console.error('Error in /api/character/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/character/default', async (req, res) => {
  try {
    const character = await prisma.character.findFirst({
      where: { name: 'User' }
    });

    if (!character) {
      throw new Error('No default character found');
    }

    res.json(character);
  } catch (error) {
    console.error('Error in /api/character/default:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, async () => {
  await ensureDefaultCharacter();
  console.log(`API server running at http://localhost:${PORT}`);
}); 