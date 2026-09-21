import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { validateRestaurant } from '../validation';

const router = Router();

// POST /api/restaurants - Ajouter un restaurant
router.post('/', async (req: Request, res: Response) => {
  const errors = validateRestaurant(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Données invalides', errors });
  }

  const { name, address, latitude, longitude, cuisine_type, phone_number } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO restaurants (name, address, latitude, longitude, cuisine_type, phone_number)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, address, latitude, longitude, cuisine_type, phone_number || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création du restaurant :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du restaurant' });
  }
});

// GET /api/restaurants - Tous les restaurants
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM restaurants ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des restaurants :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/restaurants/search?q=term - Recherche par nom ou adresse
router.get('/search', async (req: Request, res: Response) => {
  const q = req.query.q as string;
  if (!q || q.trim().length === 0) {
    return res.status(400).json({ message: 'Le paramètre de recherche "q" est requis' });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM restaurants WHERE name ILIKE $1 OR address ILIKE $1 ORDER BY created_at DESC`,
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la recherche :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/restaurants/filter?cuisine=type - Filtrer par cuisine
router.get('/filter', async (req: Request, res: Response) => {
  const cuisine = req.query.cuisine as string;
  if (!cuisine) {
    return res.status(400).json({ message: 'Le paramètre "cuisine" est requis' });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM restaurants WHERE cuisine_type = $1 ORDER BY created_at DESC`,
      [cuisine]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors du filtrage :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/restaurants/:id - Modifier un restaurant existant
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const errors = validateRestaurant(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Données invalides', errors });
  }

  const { name, address, latitude, longitude, cuisine_type, phone_number } = req.body;

  try {
    const result = await pool.query(
      `UPDATE restaurants
       SET name = $1, address = $2, latitude = $3, longitude = $4, cuisine_type = $5, phone_number = $6
       WHERE id = $7 RETURNING *`,
      [name, address, latitude, longitude, cuisine_type, phone_number || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant introuvable' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la modification du restaurant :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la modification' });
  }
});

export default router;