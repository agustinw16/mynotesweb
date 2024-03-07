const express = require('express'); //importamos el modulo "express" y los guardamos en una variable
const cors = require('cors'); // importamos el modulo "cors" 
const dbConnection = require('./dbConnection'); // Importa la conexión desde dbConnection.js

//Captura el evento cuando presiono (control+c)
process.on('SIGINT', () => {
  console.log('Finalizando la aplicación, cerrando la conexión con la base de datos...');
  // Cerrar la conexión con la base de datos al finalizar la aplicación
  dbConnection.end(()=>{
    process.exit(); //Cierro el proceso automaticamente cuando finalizo la aplicacion
  });
});

const app = express(); 

/*middleware*/

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json({
    type: "*/*"
}))

// Habilitar CORS
app.use(cors());


/***********************************************************************************************************************************/

/************ Rutas y lógica de la aplicación ***********/

//  Get 
app.get('/mynotes', (req, res) => {  

    //Contruyo la consulta a mysql 
    const sql = 'SELECT * FROM notes'; 
    /*Realizo la consulta*/
    dbConnection.query(sql,(err, resultados) => {
        if (err) {
          console.error('Error en la consulta para obtener los datos', err);
        }
        // Enviar los resultados como respuesta JSON
        res.json(resultados);
      });
});

//  Get para notas archivadas
app.get('/archive', (req, res) => {  

  const sql = 'SELECT * FROM archive'; 
  /*Realizo la consulta*/
  dbConnection.query(sql,(err, resultados) => {
      if (err) {
        console.error('Error en la consulta para obtener los datos', err);
      }
      // Enviar los resultados como respuesta JSON
      res.json(resultados);
    });
});

//  Post 
app.post('/mynotes', (req, res) => {  

    let nota = req.body; //Guardo la nota en una variable
    
    //Contruyo la consulta a mysql usando placeholders (?) como values (brinda seguridad antes ataques de inyeccion)
    const sql = 'INSERT INTO notes (title, content, lastModification) VALUES (?, ?, Now())'; 
    /*Realizo la consulta, ademas paso los valores individuales de la nota que seran los valores de la consulta en lugar de las '?'*/
    dbConnection.query(sql,[nota.noteTitle, nota.noteContent] ,(err, resultados) => {
        if (err) {
          console.error('Error en la consulta guardar', err);
        }
      });
});

// Put
app.put('/mynotes', (req, res) => {  

    let nota = req.body; //Guardo la nota en una variable

    const sql = 'UPDATE notes SET title = ?, content = ?, lastModification = Now() WHERE idNote = ?'; 
    dbConnection.query(sql,[nota.noteTitleEdited, nota.noteContentEdited, nota.id] ,(err, resultados) => {
        if (err) {
          console.error('Error en la consulta guardar', err);
        }
        res.json(resultados);
      });
});

// Put para notas archivadas
app.put('/archive', (req, res) => {  

  let nota = req.body; //Guardo la nota en una variable

  const sql = 'UPDATE archive SET title = ?, content = ?, lastModification = Now() WHERE idArchive = ?'; 
  dbConnection.query(sql,[nota.noteTitleEdited, nota.noteContentEdited, nota.id] ,(err, resultados) => {
      if (err) {
        console.error('Error en la consulta guardar', err);
      }
      res.json(resultados);
    });
});

//  Delete y archivado
app.delete('/mynotes', (req, res) => {  

    //Si identificacion(variable que esta en el fetch de script.js) es = 0, realizo el proceso de borrado normal, si no realizo el proceso de archivado
    if(req.body.identificacion == 0){

      const sql = 'DELETE FROM notes WHERE idNote = ?';
      /*Realizo la consulta*/
      dbConnection.query(sql,[req.body.id],(err, resultados) => {
        if (err) {
          console.error('Error en la consulta delete', err);
        }
        res.json(resultados);
      });

    }else{
      //Obtengo la nota que quiero eliminar
      const sqlget = 'SELECT * FROM notes WHERE idNote= ?'; 
      dbConnection.query(sqlget,[req.body.id],(err, resultados) => {
        if (err) {
          console.error('Error en la consulta para obtener los datos del archivado', err);
        }else{
          //Inserto en la tabla "archive" la nota que quiero archivar
          const fecha = new Date(resultados[0].lastModification)// Fecha de la nota
          const year = fecha.getFullYear();
          //con padStart me aseguro que el mes y el dia siempre tengan dos digitos, agregando un cero de ser necesario
          const month = String(fecha.getMonth() + 1).padStart(2, '0'); 
          const day = String(fecha.getDate()).padStart(2, '0');

          const formatoMysql= `${year}-${month}-${day}`;

          const sqlpost = 'INSERT INTO archive (title, content, lastModification) VALUES (?, ?, ?)'; 
          dbConnection.query(sqlpost,[resultados[0].title, resultados[0].content, formatoMysql] ,(err, resultados) => {
            if (err) {
              console.error('Error en la consulta guardar del archivado', err);
            }else{
              //Elimino la nota de la tabla notes
              const sql = 'DELETE FROM notes WHERE idNote = ?';
              dbConnection.query(sql,[req.body.id],(err, resultados) => {
                if (err) {
                  console.error('Error en la consulta delete del archivado', err);
                }
                res.json(resultados);
              });
            }
          });
        }
      });
    }
    
});

//  Delete para notas archivadas y desarchivado
app.delete('/archive', (req, res) => {  
  
  //Si identificacion es = 0, realizo el proceso de borrado normal, si no realizo el proceso de desarchivado
  if(req.body.identificacion == 0){

    const sql = 'DELETE FROM archive WHERE idArchive = ?';
    dbConnection.query(sql,[req.body.id],(err, resultados) => {
      if (err) {
        console.error('Error en la consulta delete', err);
      }
      res.json(resultados);
    });

  }else{
    //Obtengo la nota que quiero eliminar
    const sqlget = 'SELECT * FROM archive WHERE idArchive= ?'; 
    dbConnection.query(sqlget,[req.body.id],(err, resultados) => {
      if (err) {
        console.error('Error en la consulta para obtener los datos en el desarchivado', err);
      }else{

        //Inserto en la tabla "notes" la nota que quiero desarchivar

        const fecha = new Date(resultados[0].lastModification)// Fecha de la nota
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0'); 
        const day = String(fecha.getDate()).padStart(2, '0');

        const formatoMysql= `${year}-${month}-${day}`;

        const sqlpost = 'INSERT INTO notes (title, content, lastModification) VALUES (?, ?, ?)'; 
        dbConnection.query(sqlpost,[resultados[0].title, resultados[0].content, formatoMysql] ,(err, resultados) => {
          if (err) {
            console.error('Error en la consulta guardar en el desarchivado', err);
          }else{
            //Elimino en la tabla "archive" la nota que desarchive
            const sql = 'DELETE FROM archive WHERE idArchive = ?';
            dbConnection.query(sql,[req.body.id],(err, resultados) => {
              if (err) {
                console.error('Error en la consulta delete en el desarchivado', err);
              }
              res.json(resultados);
            });
          }
        });
      }
    });
  }
  
});
/***********************************************************************************************************************************/

/************ Iniciar el servidor ***********/
const {PORT} = require('./config'); // Importamos la variable de entorno con el valor del puerto donde correra la aplicacion
app.listen(PORT, () => {
    console.log(`Servidor Node.js ejecutandose en http://localhost:${PORT}`); //mensaje inicial para comprobar la ejecucion correcta
});