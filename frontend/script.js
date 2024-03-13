//**Creo una constante con el url del backend, de modo que si cambia la url, solo cambie esta constante y no todos los fetch */
const backendURL = 'https://mynotesweb.onrender.com'; 
//----------------------------* SECCION MY NOTES *-------------------------------------//

/*Codigo para abrir la ventana de creacion de notas*/
const openModalCrear = document.getElementById('botonCrear');
const modalCrear = document.getElementById('crearSection');
const closeModalCrear = document.getElementById('botonCancelarCrear');

// Verificar si ya se agregó el evento 'click' al botón
if (!openModalCrear.dataset.eventListenerAdded){
    openModalCrear.addEventListener('click', (event)=>{
        event.preventDefault();
        //Limpio los campos de titulo y contenido en la ventana crear nota, debido a que saque las acciones por default de form
        document.getElementById("tituloNota").value=''; 
        document.getElementById("contenidoNota").value='';  
        modalCrear.classList.add('modal--show');
    });

    // Marcar que ya se agregó el evento al botón
    openModalCrear.dataset.eventListenerAdded = true;
}
// Verificar si ya se agregó el evento 'click' al botón
if (!closeModalCrear.dataset.eventListenerAdded){     
    closeModalCrear.addEventListener('click', (event)=>{
        event.preventDefault();
        modalCrear.classList.remove('modal--show');
    });

    // Marcar que ya se agregó el evento al botón
    closeModalCrear.dataset.eventListenerAdded = true;
}

// Mostrar los objetos en el DOM
const cargarNotas = (data) => {
    let notasHTML = '';
    for(let nota of data){   // Recorro el array recibido y saco uno por uno
       notasHTML += crearNotasHTML(nota); // A cada nota le doy formato html y los concateno a una variable
    }
    document.getElementById("contenedorNotas").innerHTML = notasHTML; // Mando la cadena con todas las notas al div con id="contenedorNotas"
}

//* Funcion para pasar una nota a un formato para visualizarlo en html
const crearNotasHTML = (nota) =>{  // Recibo una nota
    
    //Tranformo la fecha para mostrarla en solo dia, mes y año
    const fechaDesdeBD = new Date(nota.lastModification); 
    const fechaString = fechaDesdeBD.toLocaleDateString();

    /*el nombre de cada variable es el nombre de la columna en la bd */
    let notaHTML = `
    <div class="cajas">
        <div class="izquierda">
            <button class="elemento_mostrar--btn"  title="Open" onclick="mostrarNota('${nota.title}','${nota.content}')"> 
                <ion-icon name="document" ></ion-icon>
            </button>
        </div>

        <div class="nota_nombre">${nota.title}</div>  
        <div class="nota_fecha">Last edited: ${fechaString}</div> 
        
        <div class="derecha">
            <div>
                <button class="elemento_archivar--btn" id="botonArchivar" title="Archive" onclick="archivarNota(${nota.idNote})"> 
                    <ion-icon name="lock-closed"></ion-icon> 
                </button>
            </div>
            <div>
                <button class="elemento_editar--btn" id="botonEditar" title="Edit" onclick="editarNota('${nota.idNote}','${nota.title}','${nota.content}')"> 
                    <ion-icon name="create"></ion-icon> 
                </button>
            </div>
            <div>
                <button class="elemento_eliminar--btn" id="botonEliminar" title="Delete" onclick="eliminarNota(${nota.idNote})"> 
                    <ion-icon name="trash" ></ion-icon>  
                </button>
            </div>
        </div> 
    </div>`
    return notaHTML;
    /* Por ejemplo si paso la nota con id=10, al crear el codigo html, asi quedara el evento onclick='eliminarNota(10)' entonces
    cuando quiera eliminar ese objeto lo hare atraves de ese id*/
}

//*Cargar nota al cargar la pagina
// Al cargar el script.js se realiza un get a la url de mi servidor para traer las notas que estan en la base de datos
fetch(`${backendURL}/mynotes`).then(response => response.json()).then(data => {
    cargarNotas(data); 
});

//* guardar una nota
const formElement=document.getElementById("guardarNota"); // Obtengo el formulario del html

// Verificar si ya se agregó el evento 'click' al botón
if (!formElement.dataset.eventListenerAdded){

    formElement.addEventListener("submit", (event)=> { 
        event.preventDefault(); //Le saco las funciones por default para evitar que se recargue la pagina
        //Asigno el valor de cada cuadro de texto a una variable
        let noteTitle = document.getElementById("tituloNota").value; 
        let noteContent = document.getElementById("contenidoNota").value; 
        //Creo un objeto con los datos de cada cuadro de texto
        let note = {noteTitle: noteTitle, noteContent: noteContent}
        //Convierto el objeto note en un objeto JSON
        let noteJSON = JSON.stringify(note);
    
        //Ahora mando los datos al backend
        fetch(`${backendURL}/mynotes`, { 
            method: 'Post', //elijo el metodo post para mi accion
            body: noteJSON // y le mando como cuerpo la variable json con los datos de la transaction
        });
    
        //AL presionar guardar tambien se me actualiza la lista 
         fetch(`${backendURL}/mynotes`).then(response => response.json()).then(data => {
            cargarNotas(data);
        });
        modalCrear.classList.remove('modal--show'); //cierro la ventana
    })

    // Marcar que ya se agregó el evento al botón
    formElement.dataset.eventListenerAdded = true;
}

//*Funcion para mostrar una nota
const mostrarNota = (titulo,contenido) =>{
    const modalMostrar = document.getElementById('mostrarSection');
    const closeModalMostrar = document.getElementById('botonCerrarMostrar');

    modalMostrar.classList.add('modal--show');

    // Verificar si ya se agregó el evento 'click' al botón
    if (!closeModalMostrar.dataset.eventListenerAdded){     
        closeModalMostrar.addEventListener('click', (event)=>{
            event.preventDefault();
            modalMostrar.classList.remove('modal--show');
        });

        // Marcar que ya se agregó el evento al botón
        closeModalMostrar.dataset.eventListenerAdded = true;
    }

    document.getElementById("tituloEnMostrar").innerHTML = titulo;
    document.getElementById("contenidoEnMostrar").innerHTML = contenido; // Mando la cadena con todas las notas al div con id="contenedorNotas"
}

//*Funcion para editar una nota
const editarNota = (id,titulo,contenido) =>{
    /*Codigo para abrir la ventana de edicion de notas*/

    const modalEditar = document.getElementById('editarSection');
    const closeModalEditar = document.getElementById('botonCancelarEditar');

    modalEditar.classList.add('modal--show');

    // Verificar si ya se agregó el evento 'click' al botón
    if (!closeModalEditar.dataset.eventListenerAdded){     
        closeModalEditar.addEventListener('click', (event)=>{
            event.preventDefault();
            modalEditar.classList.remove('modal--show');
        });

        // Marcar que ya se agregó el evento al botón
        closeModalEditar.dataset.eventListenerAdded = true;
    }

    //Obtengo referencias a los elementos input y textarea mediante su ID
    let noteTitle=document.getElementById("tituloNotaEditar"); 
    let noteContent=document.getElementById("contenidoNotaEditar"); 
    
    //Le asigno los valores que tenia para mostarlos en el input y textarea
    noteTitle.value=titulo
    noteContent.value=contenido;

    const botonGuardarEditar = document.getElementById('botonGuardarEditar');
    botonGuardarEditar.dataset.id=id; 

    // Verificar si ya se agregó el evento 'click' al botón
    if (!botonGuardarEditar.dataset.eventListenerAdded){     

        botonGuardarEditar.addEventListener('click', (event)=>{
            event.preventDefault();
    
            //Asigno el valor de cada cuadro de texto a una variable
            let noteTitleEdited = document.getElementById("tituloNotaEditar").value; 
            let noteContentEdited = document.getElementById("contenidoNotaEditar").value; 
            const id = botonGuardarEditar.dataset.id;
            //Creo un objeto con los datos de cada cuadro de texto
            let noteEdited = {id: id, noteTitleEdited: noteTitleEdited, noteContentEdited: noteContentEdited}
            //Convierto el objeto en un objeto JSON
            let noteEditedJSON = JSON.stringify(noteEdited);
    
            //Ahora mando los datos al backend 
            fetch(`${backendURL}/mynotes`, { 
                method: 'Put', //elijo el metodo post para mi accion
                body: noteEditedJSON // y le mando como cuerpo la variable json con los datos de la transaction
            }).then(response => response.json()).then(data => {
                fetch(`${backendURL}/mynotes`).then(response => response.json()).then(data => {
                    cargarNotas(data);
                });
            });         
            modalEditar.classList.remove('modal--show');
        });
    
        // Marcar que ya se agregó el evento al botón
        botonGuardarEditar.dataset.eventListenerAdded = true;
    }

}

//* Funcion eliminar una nota
/* Los fetchs estan encadenados para que el fetch de get se ejecute despues de la respuesta del fetch de delete
sino se hace de esta manera, como los fetch se ejecutan de forma asincrona normalmente, primero se ejecuta el get y despues el delete
entonces los cambios no se ven reflejados en la web*/ 
const eliminarNota = (id) => { // La funcion recibe el id de la nota

    /*Codigo para abrir la ventana de borrado de notas*/
    const modalEliminar = document.getElementById('eliminarSection');
    const closeModalEliminar = document.getElementById('botonNoEliminar');
    const botonYesEliminar = document.getElementById('botonYesEliminar');
    botonYesEliminar.dataset.id=id; 

    //como ya se presiono el icono de eliminar, la ventana se abre automaticamente
    modalEliminar.classList.add('modal--show');

    // Verificar si ya se agregó el evento 'click' al botón
    if (!closeModalEliminar.dataset.eventListenerAdded){     
        //Al presionar sobre el boton no, se cancela la accion y se cierra la ventana
        closeModalEliminar.addEventListener('click', (event)=>{
            event.preventDefault();
            modalEliminar.classList.remove('modal--show');
        });

        // Marcar que ya se agregó el evento al botón
        closeModalEliminar.dataset.eventListenerAdded = true;
    }

    if (!botonYesEliminar.dataset.eventListenerAdded){   

        //Al presionar sobre el boton yes se cierra la ventana y se borra la nota de la base de datos
        botonYesEliminar.addEventListener('click', (event)=>{
            event.preventDefault();
            modalEliminar.classList.remove('modal--show');
            
            const id=botonYesEliminar.dataset.id;

            fetch(`${backendURL}/mynotes`, { 
            method: 'Delete', //elijo el metodo delete para mi accion
            body: JSON.stringify({ id: id,identificacion : 0 }) //le mando como cuerpo el id de la nota y un identificador   
            }).then(response => response.json()).then(data => { //EL fetch de delete tiene que mandarme una respuesta del servidor, sino queda en espera 
                fetch(`${backendURL}/mynotes`).then(response => response.json()).then(data => {
                    cargarNotas(data);
                });
            }); 
        })     

        // Marcar que ya se agregó el evento al botón
        botonYesEliminar.dataset.eventListenerAdded = true;
    }


}

//* Funcion archivar una nota
const archivarNota = (id) => { 

    /*Codigo para abrir la ventana de arhivado de notas*/
    const modalArchivar = document.getElementById('archivarSection');
    const closeModalArchivar = document.getElementById('botonNoArchivar');
    const botonYesArchivar = document.getElementById('botonYesArchivar');

    //#region comment

    /*
    Funcionamiento: De cada nota que se muestra, se obtiene su id (el cual cambia cada vez que se la archiva) y se lo guarda en la funcion 
    correspondiente a c/u de los botones eliminar,editar y archivar entonces cuando quiero hacer alguna de esas acciones obtengo ese id 
    con la funcion al hacer click y lo paso por el fetch hasta el servidor

    Problema: al obtener el id de una nota y luego usar ese id dentro de la funcion del botonYesArchivar.addEventListener 
    ese id no se actualizaba cuando llamaba nuevamente a la funcion archivar debido a una particularidad de la funcion addEventListener
    
    Solucion: la solucion fue, una vez obtenido el id y el botonYesArchivar, asignale al boton un atributo con la funcion dataset
    ese atributo seria el id obtenido y de esta manera se lo puede usar dentro del addEventListener y se actualiza correctamente
    */
    //#endregion
    
    botonYesArchivar.dataset.id=id; 

    //como ya se presiono el icono de archivar, la ventana se abre automaticamente
    modalArchivar.classList.add('modal--show');

    //Al presionar sobre el boton no se cancela la accion y se cierra la ventana
    if (!closeModalArchivar.dataset.eventListenerAdded){     // Verificar si ya se agregó el evento 'click' al botón
        closeModalArchivar.addEventListener('click', (event)=>{
            event.preventDefault();
            modalArchivar.classList.remove('modal--show');
        });

        // Marcar que ya se agregó el evento al botón
        closeModalArchivar.dataset.eventListenerAdded = true;
    }

    
    //#region comment
    /*
    Problema: cada vez que llamaba a la funcion archivarNota y se ejecutaba el codigo botonYesArchivar.addEventListener('click'
    al botonYesArchivar se le iba agregando un nuevo adddEventListener('click') entonces cuando llamaba a la funcionar archivarNota 
    por segunda vez el boton ya tenia dos addEventListener entonces se ejecutaba el codigo 2 veces y me generaba un error porque la 
    primera llamada me archivaba la nota pero la segunda llamada ya no encontraba la nota en la base de datos
    
    Solucion: la solucion fue, agregar un control, el codigo verifica si el atributo agregado con dataset es true o false, como la primera
    vezque se llama a la funcion archivarNota el atributo es false se agrega el addEventListener y le setea el atributo en true, entonces
    la segunda vez que se llama a la funcion se verifica que ya se agrego el evento addEventListener entonces no se lo vuelve a agregar

    NOTA: el evento agregado con addEventListener se agrega al boton y queda guardado en este, por lo tanto solo hay que agregarle un evento
    a cada elemento
    */
    //#endregion
    
    // Verificar si ya se agregó el evento 'click' al botón
    if (!botonYesArchivar.dataset.eventListenerAdded) {
        botonYesArchivar.addEventListener('click', (event) => {
            event.preventDefault();
            modalArchivar.classList.remove('modal--show');
            const id = botonYesArchivar.dataset.id;

            fetch(`${backendURL}/mynotes`, { 
                method: 'Delete',
                body: JSON.stringify({ id: id, identificacion : 1 })
            }).then(response => response.json()).then(data => {
                fetch(`${backendURL}/mynotes`).then(response => response.json()).then(data => {
                cargarNotas(data);
                });
            }); 
        });

        // Marcar que ya se agregó el evento al botón
        botonYesArchivar.dataset.eventListenerAdded = true;
    } 
}


//----------------------------* SECCION ARCHIVED NOTES *-------------------------------------//

// Mostrar los objetos en el DOM
const cargarNotasArchivadas = (data) => {
    let notasHTML = '';
    for(let nota of data){   // Recorro el array recibido y saco uno por uno
       notasHTML += crearNotasHTMLArchivadas(nota); // A cada nota le doy formato html y los concateno a una variable
    }
    document.getElementById("contenedorNotasArchivadas").innerHTML = notasHTML; // Mando la cadena con todas las notas al div con id="contenedorNotas"
}

//* Funcion para pasar una nota a un formato para visualizarlo en html
const crearNotasHTMLArchivadas = (nota) =>{  // Recibo una nota
    
    //Tranformo la fecha para mostrarla en solo dia, mes y año
    const fechaDesdeBD = new Date(nota.lastModification); 
    const fechaString = fechaDesdeBD.toLocaleDateString();

    /*el nombre de cada variable es el nombre de la columna en la bd */
    let notaHTML = `
    <div class="cajas">
        <div class="izquierda">
            <button class="elemento_mostrar--btn"  title="Open" onclick="mostrarNotaArchivada('${nota.title}','${nota.content}')"> 
                <ion-icon name="document"></ion-icon>
            </button>
        </div>
        
        <div class="nota_nombre">${nota.title}</div>  
        <div class="nota_fecha">Last edited: ${fechaString}</div> 
        
        <div class="derecha">
            <div>
                <button class="elemento_archivar--btn" id="botonDesarchivar" title="Unarchive" onclick="desarchivarNota(${nota.idArchive})"> 
                <ion-icon name="lock-open"></ion-icon>
                </button>
            </div>
            <div>
                <button class="elemento_editar--btn" id="botonEditarD" title="Edit" onclick="editarNotaArchivada('${nota.idArchive}','${nota.title}','${nota.content}')"> 
                    <ion-icon name="create"></ion-icon> 
                </button>
            </div>
            <div>
                <button class="elemento_eliminar--btn" id="botonEliminarD" title="Delete" onclick="eliminarNotaArchivada(${nota.idArchive})"> 
                    <ion-icon name="trash" ></ion-icon>  
                </button>
            </div>
        </div> 
    </div>`
    return notaHTML;
    /* Por ejemplo si paso la nota con id=10, al crear el codigo html, asi quedara el evento onclick='eliminarNota(10)' entonces
    cuando quiera eliminar ese objeto lo hare atraves de ese id*/
}

//*Cargar nota al cargar la pagina
fetch(`${backendURL}/archive`).then(response => response.json()).then(data => {
    cargarNotasArchivadas(data); 
});

//*Funcion para mostrar una nota archivada
const mostrarNotaArchivada = (titulo,contenido) =>{
    const modalMostrar = document.getElementById('mostrarSectionArchivado');
    const closeModalMostrar = document.getElementById('botonCerrarMostrarArchivado');

    modalMostrar.classList.add('modal--show');

    // Verificar si ya se agregó el evento 'click' al botón
    if (!closeModalMostrar.dataset.eventListenerAdded){     
        closeModalMostrar.addEventListener('click', (event)=>{
            event.preventDefault();
            modalMostrar.classList.remove('modal--show');
        });

        // Marcar que ya se agregó el evento al botón
        closeModalMostrar.dataset.eventListenerAdded = true;
    }

    document.getElementById("tituloEnMostrarArchivado").innerHTML = titulo;
    document.getElementById("contenidoEnMostrarArchivado").innerHTML = contenido; // Mando la cadena con todas las notas al div con id="contenedorNotas"
}

//*Funcion para editar una nota archivada
const editarNotaArchivada = (id,titulo,contenido) =>{
    /*Codigo para abrir la ventana de edicion de notas*/

    const modalEditar = document.getElementById('editarSectionArchivado');
    const closeModalEditar = document.getElementById('botonCancelarEditarArchivado');

    modalEditar.classList.add('modal--show');

    // Verificar si ya se agregó el evento 'click' al botón
    if (!closeModalEditar.dataset.eventListenerAdded){     
        closeModalEditar.addEventListener('click', (event)=>{
            event.preventDefault();
            modalEditar.classList.remove('modal--show');
        });
    
        // Marcar que ya se agregó el evento al botón
        closeModalEditar.dataset.eventListenerAdded = true;
    }

    //Obtengo referencias a los elementos input y textarea mediante su ID
    let noteTitle=document.getElementById("tituloNotaEditarArchivado"); 
    let noteContent=document.getElementById("contenidoNotaEditarArchivado"); 
    
    //Le asigno los valores que tenia para mostarlos en el input y textarea
    noteTitle.value=titulo
    noteContent.value=contenido;

    const botonGuardarEditar = document.getElementById('botonGuardarEditarArchivado');
    botonGuardarEditar.dataset.id=id;

    // Verificar si ya se agregó el evento 'click' al botón
    if (!botonGuardarEditar.dataset.eventListenerAdded){   

        botonGuardarEditar.addEventListener('click', (event)=>{
            event.preventDefault();
    
            //Asigno el valor de cada cuadro de texto a una variable
            let noteTitleEdited = document.getElementById("tituloNotaEditarArchivado").value; 
            let noteContentEdited = document.getElementById("contenidoNotaEditarArchivado").value;
            const id=botonGuardarEditar.dataset.id; 
            //Creo un objeto con los datos de cada cuadro de texto
            let noteEdited = {id: id, noteTitleEdited: noteTitleEdited, noteContentEdited: noteContentEdited}
            //Convierto el objeto en un objeto JSON
            let noteEditedJSON = JSON.stringify(noteEdited);
    
            //Ahora mando los datos al backend 
            fetch(`${backendURL}/archive`, { 
                method: 'Put', //elijo el metodo post para mi accion
                body: noteEditedJSON // y le mando como cuerpo la variable json con los datos de la transaction
            }).then(response => response.json()).then(data => {
                fetch(`${backendURL}/archive`).then(response => response.json()).then(data => {
                    cargarNotasArchivadas(data);
                });
            });         
            modalEditar.classList.remove('modal--show');
        });
    
        // Marcar que ya se agregó el evento al botón
        botonGuardarEditar.dataset.eventListenerAdded = true;
    }



}

//* Funcion eliminar una nota archivada

const eliminarNotaArchivada = (id) => { // La funcion recibe el id de la nota

    /*Codigo para abrir la ventana de borrado de notas*/
    const modalEliminar = document.getElementById('eliminarSectionArchivado');
    const closeModalEliminar = document.getElementById('botonNoEliminarArchivado');
    const botonYesEliminar = document.getElementById('botonYesEliminarArchivado');
    botonYesEliminar.dataset.id = id;

    //como ya se presiono el icono de eliminar, la ventana se abre automaticamente
    modalEliminar.classList.add('modal--show');

    // Verificar si ya se agregó el evento 'click' al botón
    if (!closeModalEliminar.dataset.eventListenerAdded){     
        //Al presionar sobre el boton no se cancela la accion y se cierra la ventana
        closeModalEliminar.addEventListener('click', (event)=>{
            event.preventDefault();
            modalEliminar.classList.remove('modal--show');
        });
    
        // Marcar que ya se agregó el evento al botón
        closeModalEliminar.dataset.eventListenerAdded = true;
    }

    // Verificar si ya se agregó el evento 'click' al botón
    if (!botonYesEliminar.dataset.eventListenerAdded){     

        //Al presionar sobre el boton yes se cierra la ventana y se borra la nota de la base de datos
        botonYesEliminar.addEventListener('click', (event)=>{
            event.preventDefault();
            modalEliminar.classList.remove('modal--show');
            const id=botonYesEliminar.dataset.id;

            fetch(`${backendURL}/archive`, { 
            method: 'Delete', //elijo el metodo delete para mi accion
            body: JSON.stringify({ id: id,identificacion : 0 }) //le mando como cuerpo el id de la nota y un identificador   
            }).then(response => response.json()).then(data => { //EL fetch de delete tiene que mandarme una respuesta del servidor, sino queda en espera 
                fetch(`${backendURL}/archive`).then(response => response.json()).then(data => {
                    cargarNotasArchivadas(data);
                });
            }); 
        }) 

        // Marcar que ya se agregó el evento al botón
        botonYesEliminar.dataset.eventListenerAdded = true;
    }

}

//* Funcion desarchivar una nota
const desarchivarNota = (id) => { 

    /*Codigo para abrir la ventana de arhivado de notas*/
    const modalDesarchivar = document.getElementById('desarchivarSection');
    const closeModalDesarchivar = document.getElementById('botonNoDesarchivar');
    const botonYesDesarchivar = document.getElementById('botonYesDesarchivar');
    botonYesDesarchivar.dataset.id=id;

    //como ya se presiono el icono de archivar, la ventana se abre automaticamente
    modalDesarchivar.classList.add('modal--show');

    // Verificar si ya se agregó el evento 'click' al botón
    if (!closeModalDesarchivar.dataset.eventListenerAdded){    

        //Al presionar sobre el boton no se cancela la accion y se cierra la ventana
        closeModalDesarchivar.addEventListener('click', (event)=>{
            event.preventDefault();
            modalDesarchivar.classList.remove('modal--show');
        });
    
        // Marcar que ya se agregó el evento al botón
        closeModalDesarchivar.dataset.eventListenerAdded = true;
    }



    // Verificar si ya se agregó el evento 'click' al botón
    if (!botonYesDesarchivar.dataset.eventListenerAdded){  

        //Al presionar sobre el boton yes se cierra la ventana y se archiva la nota
        botonYesDesarchivar.addEventListener('click', (event)=>{
            event.preventDefault();
            modalDesarchivar.classList.remove('modal--show');
            const id=botonYesDesarchivar.dataset.id;

            fetch(`${backendURL}/archive`, { 
            method: 'Delete', //elijo el metodo delete para mi accion
            body: JSON.stringify({ id: id, identificacion : 1 }) //le mando como cuerpo el id de la nota y un identificador      
            }).then(response => response.json()).then(data => {
                fetch(`${backendURL}/archive`).then(response => response.json()).then(data => {
                    cargarNotasArchivadas(data);
                });
            }); 
        })
    
        // Marcar que ya se agregó el evento al botón
        botonYesDesarchivar.dataset.eventListenerAdded = true;
    }

     
}

//----------------------------* CAMBIO DE SECCIONES *-------------------------------------//

/*Codigo para cambiar la pestaña de "My Notes" a "Archived notes"*/
const archivoEnlace = document.getElementById('archivoEnlace');
 
    // Verificar si ya se agregó el evento 'click' al botón
    if (!archivoEnlace.dataset.eventListenerAdded){    
        
        archivoEnlace.addEventListener('click', (event) => {
            event.preventDefault();

            //*Cargo notas al pasar a la seccion "Archived notes"
            fetch(`${backendURL}/archive`).then(response => response.json()).then(data => {
                cargarNotasArchivadas(data); 
            });

            const notasSection = document.getElementById('notasSection');
            const archivoSection = document.getElementById('archivoSection');
            notasSection.style.display = 'none';
            archivoSection.style.display = 'block';
            //notasSection.hidden = true;
            //archivoSection.hidden = false;
        });

        // Marcar que ya se agregó el evento al botón
        archivoEnlace.dataset.eventListenerAdded = true;
    }


const misNotasEnlace = document.getElementById('misNotasEnlace');

    // Verificar si ya se agregó el evento 'click' al botón
    if (!misNotasEnlace.dataset.eventListenerAdded){    

        misNotasEnlace.addEventListener('click', (event) => {
            event.preventDefault();
        
            //*Cargo notas al pasar a la seccion "My Notes"
            fetch(`${backendURL}/mynotes`).then(response => response.json()).then(data => {
                cargarNotas(data); 
            });
        
            const notasSection = document.getElementById('notasSection');
            const archivoSection = document.getElementById('archivoSection');
            notasSection.style.display = 'block';
            archivoSection.style.display = 'none';
            //notasSection.hidden = false;
            //archivoSection.hidden = true;
        });
    
        // Marcar que ya se agregó el evento al botón
        misNotasEnlace.dataset.eventListenerAdded = true;
    }

