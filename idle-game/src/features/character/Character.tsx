import { useEffect, useState } from 'react';
import { getCharacter } from '../../api/character';
import './Character.css';

interface CharacterData {
  name: string;
  woodcutting_level: number;
  woodcutting_xp: number;
}

export default function Character() {
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCharacter = async () => {
      try {
        const data = await getCharacter();
        setCharacter(data);
      } catch (error) {
        console.error('Error loading character:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!character) return <div>No character found</div>;

  return (
    <div className="character">
      <h2>{character.name}</h2>
      <div className="stats">
        <p>Woodcutting Level: {character.woodcutting_level}</p>
        <p>Woodcutting XP: {character.woodcutting_xp}</p>
      </div>
    </div>
  );
} 