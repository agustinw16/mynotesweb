//*Archivo con las variables de entorno para configuar el backend

/*Variable para el puerto donde correra la API, sera la variable de entorno PORT y si no existe toma el valor de 3000*/
const PORT = process.env.PORT || 3000

/*Variables para la conexion de la base de datos, si no encuentra las variables de entorno, toma el valor del string*/
const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_USER = process.env.DB_USER || 'usuarioApi'
const DB_PASSWORD = process.env.DB_PASSWORD || 'contraseñaApi'
const DB_DATABASE = process.env.DB_DATABASE || 'notesdb'

/*Exporto el modulo con las variables para ser utilizada por otros archivos*/
module.exports = {
    PORT,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE
};