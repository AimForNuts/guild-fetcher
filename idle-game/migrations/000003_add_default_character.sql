-- Add default character
INSERT INTO characters (name, woodcutting_level, woodcutting_xp)
VALUES ('User', 1, 0)
ON CONFLICT (name) DO NOTHING; 