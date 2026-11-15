const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * /api/pasajeros:
 *   get:
 *     summary: Obtener todos los pasajeros
 *     tags: [Pasajeros]
 *     responses:
 *       200:
 *         description: Lista de pasajeros obtenida correctamente
 */
router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM pasajeros ORDER BY id_pasajero'
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}); 

/**
 * @swagger
 * /api/pasajeros:
 *   post:
 *     summary: Registrar un nuevo pasajero
 *     tags: [Pasajeros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - numero_pasaporte
 *               - nacionalidad
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan Perez
 *               numero_pasaporte:
 *                 type: string
 *                 example: P10001
 *               nacionalidad:
 *                 type: string
 *                 example: Mexicana
 *     responses:
 *       201:
 *         description: Pasajero registrado correctamente
 */

router.post('/', async (req, res) => {
    try {
        const { nombre, numero_pasaporte, nacionalidad } = req.body;

        const result = await db.query(
            `INSERT INTO pasajeros (nombre, numero_pasaporte, nacionalidad)
             VALUES ($1, $2, $3) RETURNING *`,
            [nombre, numero_pasaporte, nacionalidad]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pasajeros/{id}:
 *   put:
 *     summary: Actualiza un pasajero
 *     tags: [Pasajeros]
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
 *               nombre:
 *                 type: string
 *                 example: "Juan Perez"
 *               numero_pasaporte:
 *                 type: string
 *                 example: "P10001"
 *               nacionalidad:
 *                 type: string
 *                 example: "Mexicana"
 *     responses:
 *       200:
 *         description: Pasajero actualizado.
 */

router.put('/:id', async (req, res) => {
    try {
        const { nombre, numero_pasaporte, nacionalidad } = req.body;
        const { id } = req.params;

        const result = await db.query(
            `UPDATE pasajeros SET nombre = $1, numero_pasaporte = $2, nacionalidad = $3
             WHERE id_pasajero = $4 RETURNING *`,
            [nombre, numero_pasaporte, nacionalidad, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Pasajero no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pasajeros/{id}:
 *   delete:
 *     summary: Elimina un pasajero
 *     tags: [Pasajeros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pasajero eliminado.
 */

router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query(
            'DELETE FROM pasajeros WHERE id_pasajero = $1 RETURNING *',
            [req.params.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Pasajero no encontrado' });
        }

        res.status(200).json({ mensaje: 'Pasajero eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
