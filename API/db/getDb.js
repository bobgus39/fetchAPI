require('dotenv').config();

const { Connection, Request } = require('tedious');
const { DB_USER, DB_PASSWORD, DB_SERVER, DB_DATABASE } = process.env;

function getDb(page, pageSize) {
    return new Promise((resolve, reject) => {
        const config = {
            server: DB_SERVER,
            authentication: {
                type: 'default',
                options: {
                    userName: DB_USER,
                    password: DB_PASSWORD,
                },
            },
            options: {
                encrypt: true,
                database: DB_DATABASE,
            },
        };

        const connection = new Connection(config);

        connection.on('connect', function (err) {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }

            console.log('Connected');

            const results = [];

            // Calcular el número de resultados que se deben omitir según la página actual
            const skipRows = (page - 1) * pageSize;

            const query = `SELECT * FROM ALOJAMIENTO ORDER BY Identifier DESC OFFSET ${skipRows} ROWS FETCH NEXT ${pageSize} ROWS ONLY`;

            const request = new Request(query, function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
            });

            request.on('row', function (columns) {
                const result = {};
                columns.forEach(function (column) {
                    result[column.metadata.colName] = column.value;
                });

                results.push(result);
            });

            request.on('requestCompleted', function () {
                // Se han recuperado todos los resultados para la página actual
                resolve(results); // Resuelve la promesa con los resultados una vez completada la consulta
                connection.close();
            });

            connection.execSql(request);
        });

        connection.connect();
    });
}

module.exports = getDb;
