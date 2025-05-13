import { Pool } from 'pg';

const pool = new Pool({
    connectionString: 'postgresql://testeDB_owner:6BZCw3rMxRcq@ep-icy-sea-a2mwr4mx-pooler.eu-central-1.aws.neon.tech/testeDB?sslmode=require'
});

export interface Character {
    id: number;
    name: string;
    woodcutting_level: number;
    woodcutting_xp: number;
    created_at: Date;
    updated_at: Date;
}

export async function createCharacter(name: string): Promise<Character> {
    const result = await pool.query(
        'INSERT INTO characters (name) VALUES ($1) RETURNING *',
        [name]
    );
    return result.rows[0];
}

export async function getCharacter(id: number): Promise<Character | null> {
    const result = await pool.query(
        'SELECT * FROM characters WHERE id = $1',
        [id]
    );
    return result.rows[0] || null;
}

export async function updateWoodcuttingStats(id: number, level: number, xp: number): Promise<Character | null> {
    const result = await pool.query(
        'UPDATE characters SET woodcutting_level = $1, woodcutting_xp = $2 WHERE id = $3 RETURNING *',
        [level, xp, id]
    );
    return result.rows[0] || null;
}

export async function getAllCharacters(): Promise<Character[]> {
    const result = await pool.query('SELECT * FROM characters');
    return result.rows;
} 