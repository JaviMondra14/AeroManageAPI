const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * /api/vuelos:
 *   get:
 *     summary: Obtener todos los vuelos
 *     tags: [Vuelos]
 *     responses:
 *       200:
 *         description: Lista de vuelos obtenida correctamente
 */
router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM vuelos ORDER BY id_vuelo'
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}); 

/**
 * @swagger
 * /api/vuelos:
 *   post:
 *     summary: Registrar un nuevo vuelo
 *     tags: [Vuelos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: true    
 *             properties:
 *               origen:
 *                 type: string
 *                 example: Querétaro
 *               destino:
 *                 type: string
 *                 example: Ciudad de México
 *               fecha_hora:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-12-01 08:00:00
 *               id_avion:
 *                 type: integer
 *                 example: 1            
 *     responses:
 *       201:
 *         description: Vuelo registrado correctamente
 */

router.post('/', async (req, res) => {
    try {
        const { origen, destino, fecha_hora, id_avion } = req.body;

        const result = await db.query(
            `INSERT INTO vuelos (origen, destino, fecha_hora, id_avion)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [origen, destino, fecha_hora, id_avion]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/vuelos/{id}:
 *   put:
 *     summary: Actualiza un vuelo
 *     tags: [Vuelos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origen:
 *                 type: string
 *                 example: "Querétaro"
 *               destino:
 *                 type: string
 *                 example: "Ciudad de México"
 *               fecha_hora:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-12-01 08:00:00"
 *               id_avion:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Vuelo actualizado.
 */

router.put('/:id', async (req, res) => {
    try {
        const { origen, destino, fecha_hora, id_avion } = req.body;
        const { id } = req.params;

        const result = await db.query(
            `UPDATE vuelos SET origen = $1, destino = $2, fecha_hora = $3, id_avion = $4
             WHERE id_vuelo = $5 RETURNING *`,
            [origen, destino, fecha_hora, id_avion, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Vuelo no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/vuelos/{id}:
 *   delete:
 *     summary: Elimina un vuelo
 *     tags: [Vuelos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vuelo eliminado.
 */

router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query(
            'DELETE FROM vuelos WHERE id_vuelo = $1 RETURNING *',
            [req.params.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Vuelo no encontrado' });
        }

        res.status(200).json({ mensaje: 'Vuelo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
