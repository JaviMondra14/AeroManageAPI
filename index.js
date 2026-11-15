const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();
app.use(cors());
app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AeroManage API',
            version: '1.0.0',
            description: 'API para la gestión de vuelos, aviones, pasajeros y equipaje de una aerolínea.'
        },
        servers: [
            {
                url: 'http://localhost:3000'
            }
        ]
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const rutasAviones = require('./routes/aviones');
const rutasVuelos = require('./routes/vuelos');
const rutasPasajeros = require('./routes/pasajeros');
const rutasBoletos = require('./routes/boletos_equipaje');

app.use('/api/aviones', rutasAviones);
app.use('/api/vuelos', rutasVuelos);
app.use('/api/pasajeros', rutasPasajeros);
app.use('/api/boletos_equipaje', rutasBoletos);

const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo exitosamente en http://localhost:${PUERTO}`);
    console.log(`Documentación interactiva lista en http://localhost:${PUERTO}/api-docs`);
});