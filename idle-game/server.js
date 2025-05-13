import express from 'express';
import cors from 'cors';
import { getCurrentCharacter, setCurrentCharacter, getDefaultCharacter } from './src/api/character.js';

const app = express();
const port = 3001;

// Configure CORS
app.use(cors({
    origin: 'http://localhost:5173', // Vite dev server port
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

app.get('/api/character/current', async (req, res) => {
    try {
        console.log('Fetching current character...');
        const character = await getCurrentCharacter();
        console.log('Current character found:', character);
        res.json(character);
    } catch (error) {
        console.error('Error in /api/character/current:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/character/:id', async (req, res) => {
    try {
        console.log(`Fetching character with ID: ${req.params.id}`);
        const character = await setCurrentCharacter(parseInt(req.params.id));
        console.log('Character found:', character);
        res.json(character);
    } catch (error) {
        console.error('Error in /api/character/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/character/default', async (req, res) => {
    try {
        console.log('Fetching default character...');
        const character = await getDefaultCharacter();
        console.log('Default character found:', character);
        res.json(character);
    } catch (error) {
        console.error('Error in /api/character/default:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 