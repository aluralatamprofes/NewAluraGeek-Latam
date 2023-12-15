// Obtén el contenedor de productos mediante su ID
const productsContainer = document.getElementById( 'products-container' );

// Función para enviar datos mediante POST
function postData ( event ) {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    // Obtén los valores de los campos de entrada
    const nombre = document.getElementById( 'nombreInput' ).value;
    const precio = document.getElementById( 'precioInput' ).value;
    const imagen = document.getElementById( 'imagenInput' ).value;

    // Crea el objeto de datos a enviar
    const data = {
        nombre: nombre,
        precio: precio,
        imagen: imagen,
    };

    // Realiza la solicitud POST
    fetch( 'http://localhost:3000/productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( data )
    } )
        .then( response => response.json() )
        .then( data => {
            console.log( 'Solicitud POST exitosa:', data );
            // Después de una solicitud POST exitosa, crea la tarjeta
            createCard( data.nombre, data.precio, data.imagen );
        } )
        .catch( error => {
            console.error( 'Error en la solicitud POST:', error );
        } );

    // Limpia los valores del formulario después de agregar la tarjeta
    event.target.reset();
}

// Función para crear una tarjeta (div con la clase 'card' y atributo de datos)
function createCard ( nombre, precio, imgSrc ) {
    const card = document.createElement( 'div' );
    card.classList.add( 'card' );

    // Contenido de la tarjeta
    card.innerHTML = `
            <div class="img-container">
                <img src="${imgSrc}" alt="${nombre}">
            </div>
            <div class="card-container--info">
                <p>${nombre}</p>
                <div class="card-container--value">
                    <p>$ ${precio}</p>
                    <img src="./assets/trashIcon.svg" alt="Eliminar">
                </div>
            </div>
        `;

    // Agrega la tarjeta al contenedor de productos
    productsContainer.appendChild( card );
    card.dataset.id = id
    console.log( id );

    // Retorna la tarjeta creada 
    return card;
}

//Función listar productos -- GET
const listaProductos = async () => {
    const fetchProducts = await fetch( "http://localhost:3000/productos" )
        .then( ( res ) => res.json() )
        .catch( ( err ) => console.log( err ) );

    return fetchProducts;
};

// Función que renderiza los productos en la pantalla
const render = async () => {
    try {
        const productos = await listaProductos();

        if ( productos && productos.length > 0 ) {
            productos.forEach( ( product ) => {
                createCard( product.imagen, product.nombre, product.precio );
            } );
        } else {
            console.log( "No hay productos para mostrar." );
        }

    } catch ( error ) {
        console.log( "Error al obtener la lista de productos:", error );
    }
}

render();


// Asocia la función postData al evento submit del formulario
document.getElementById( 'productForm' ).addEventListener( 'submit', postData );
