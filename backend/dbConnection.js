const mysql = require('mysql2');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE} = require('./config'); /*Impotamos las variables de entorno que usaremos como valores para la conexion*/
// Crea la conexión a la base de datos
const connection = mysql.createPool({
    // Configura los detalles de la conexión a la base de datos
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE
  });
  
connection.query('select 1 + 1', (err, rows) => { /* */ });
//exporto la conexion para que pueda ser utilizada en otros archivos del proyecto.
module.exports = connection;