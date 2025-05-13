'use client';

import { useEffect, useState } from 'react';

interface Character {
  name: string;
  woodcutting_level: number;
  woodcutting_xp: number;
}

export default function Home() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch('/api/character');
        const data = await response.json();
        setCharacter(data);
      } catch (error) {
        console.error('Failed to fetch character:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!character) return <div className="p-4">No character found</div>;

  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Character</h1>
      <div className="bg-white p-4 rounded shadow">
        <p className="text-lg">Name: {character.name}</p>
        <p className="text-lg">Woodcutting Level: {character.woodcutting_level}</p>
        <p className="text-lg">Woodcutting XP: {character.woodcutting_xp}</p>
      </div>
    </main>
  );
} 