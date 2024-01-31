require('dotenv').config();

const express = require('express');
const cors = require('cors');
const getDb = require('./db/getDb.js');

const app = express();
const port = 3000;

app.use(cors());

// Ruta para obtener y mostrar datos de la tabla ALOJAMIENTO
app.get('/ver-datos', async (req, res) => {
    const { page, size } = req.query;
    const pageNumber = parseInt(page) || 0;
    const pageSize = parseInt(size) || 10; // Establece un tamaño de página predeterminado

    try {
        const result = await getDb(pageNumber, pageSize);
        console.log('result', result);
        res.json({
            status: 'ok',
            data: result,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener datos de la base de datos.');
    }
});

app.listen(port, () => {
    console.log(`La aplicación está escuchando en http://localhost:${port}`);
});
