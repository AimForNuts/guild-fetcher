-- Add avatar_url column to characters table
ALTER TABLE characters ADD COLUMN avatar_url VARCHAR(255) DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'; 