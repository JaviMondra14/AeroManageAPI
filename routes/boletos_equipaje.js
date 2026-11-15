const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * /api/boletos_equipaje:
 *   get:
 *     summary: Obtener todos los boletos y equipaje
 *     tags: [Boletos_Equipaje]
 *     responses:
 *       200:
 *         description: Lista de boletos y equipaje obtenida correctamente
 */
router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM boletos_equipaje ORDER BY id_boleto'
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}); 

/**
 * @swagger
 * /api/boletos_equipaje:
 *   post:
 *     summary: Registrar un nuevo boleto o equipaje
 *     tags: [Boletos_Equipaje]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numero_asiento
 *               - kilos_equipaje
 *               - id_pasajero
 *               - id_vuelo
 *             properties:
 *               numero_asiento:
 *                 type: string
 *                 example: "1A"
 *               kilos_equipaje:
 *                 type: number
 *                 format: float
 *                 example: 15.5
 *               id_pasajero:
 *                 type: integer
 *                 example: 1
 *               id_vuelo:
 *                 type: integer
 *                 example: 1       
 *     responses:
 *       201:
 *         description: Boletos y equipaje registrados correctamente
 */

router.post('/', async (req, res) => {
    try {
        const { numero_asiento, kilos_equipaje, id_pasajero, id_vuelo } = req.body;

        const result = await db.query(
            `INSERT INTO boletos_equipaje (numero_asiento, kilos_equipaje, id_pasajero, id_vuelo)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [numero_asiento, kilos_equipaje, id_pasajero, id_vuelo]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/boletos_equipaje/{id}:
 *   put:
 *     summary: Actualiza un boleto o equipaje
 *     tags: [Boletos_Equipaje]
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
 *               numero_asiento:
 *                 type: string
 *                 example: "1A"
 *               kilos_equipaje:
 *                 type: number
 *                 format: float
 *                 example: 15.5
 *               id_pasajero:
 *                 type: integer
 *                 example: 1
 *               id_vuelo:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Boletos y equipaje actualizados.
 */

router.put('/:id', async (req, res) => {
    try {
        const { numero_asiento, kilos_equipaje, id_pasajero, id_vuelo } = req.body;
        const { id } = req.params;

        const result = await db.query(
            `UPDATE boletos_equipaje SET numero_asiento = $1, kilos_equipaje = $2, id_pasajero = $3, id_vuelo = $4
             WHERE id_boleto = $5 RETURNING *`,
            [numero_asiento, kilos_equipaje, id_pasajero, id_vuelo, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Boleto o equipaje no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/boletos_equipaje/{id}:
 *   delete:
 *     summary: Elimina un boleto o equipaje
 *     tags: [Boletos_Equipaje]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Boletos y equipaje eliminados.
 */

router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query(
            'DELETE FROM boletos_equipaje WHERE id_boleto = $1 RETURNING *',
            [req.params.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Boleto o equipaje no encontrado' });
        }

        res.status(200).json({ mensaje: 'Boleto o equipaje eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
