import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db';
import restaurantsRouter from './routes/restaurants';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/restaurants', restaurantsRouter);

// Route de test pour vérifier que le serveur et la BDD répondent
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', dbTime: result.rows[0].now });
  } catch (error) {
    console.error('Erreur de connexion BDD :', error);
    res.status(500).json({ status: 'error', message: 'Connexion à la base de données impossible' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});