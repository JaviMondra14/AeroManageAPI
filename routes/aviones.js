const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * /api/aviones:
 *   get:
 *     summary: Obtener todos los aviones
 *     tags: [Aviones]
 *     responses:
 *       200:
 *         description: Lista de aviones obtenida correctamente
 */
router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM aviones ORDER BY id_avion'
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}); 

/**
 * @swagger
 * /api/aviones:
 *   post:
 *     summary: Registrar un nuevo avion
 *     tags: [Aviones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modelo
 *               - matricula
 *               - capacidad_total
 *             properties:
 *               modelo:
 *                 type: string
 *                 example: Airbus A320
 *               matricula:
 *                 type: string
 *                 example: XA-011
 *               capacidad_total:
 *                 type: integer
 *                 example: 180
 *     responses:
 *       201:
 *         description: Avión registrado correctamente
 */

router.post('/', async (req, res) => {
    try {
        const { modelo, matricula, capacidad_total } = req.body;

        const result = await db.query(
            `INSERT INTO aviones (modelo, matricula, capacidad_total)
             VALUES ($1, $2, $3) RETURNING *`,
            [modelo, matricula, capacidad_total]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/aviones/{id}:
 *   put:
 *     summary: Actualiza un avion
 *     tags: [Aviones]
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
 *               modelo:
 *                 type: string
 *                 example: "Airbus A320"
 *               matricula:
 *                 type: string
 *                 example: "XA-011"
 *               capacidad_total:
 *                 type: integer
 *                 example: 180
 *     responses:
 *       200:
 *         description: Avión actualizado.
 */

router.put('/:id', async (req, res) => {
    try {
        const { modelo, matricula, capacidad_total } = req.body;
        const { id } = req.params;

        const result = await db.query(
            `UPDATE aviones
             SET modelo = $1, matricula = $2, capacidad_total = $3
             WHERE id_avion = $4 RETURNING *`,
            [modelo, matricula, capacidad_total, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Avión no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/aviones/{id}:
 *   delete:
 *     summary: Elimina un avion
 *     tags: [Aviones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Avión eliminado.
 */

router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query(
            'DELETE FROM aviones WHERE id_avion = $1 RETURNING *',
            [req.params.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Avión no encontrado' });
        }

        res.status(200).json({ mensaje: 'Avión eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
