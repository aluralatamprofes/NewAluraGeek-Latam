// Obtén el contenedor de productos mediante su ID
const productsContainer = document.getElementById( 'products-container' );

// Función para enviar datos mediante POST
function postData ( event ) {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    // Obtén los valores de los campos de entrada
    const nombre = document.getElementById( 'nombreInput' ).value;
    const precio = document.getElementById( 'precioInput' ).value;
    const imgSrc = document.getElementById( 'imagenInput' ).value;

    // Crea el objeto de datos a enviar
    const data = {
        nombre: nombre,
        precio: precio,
        imagen: imgSrc,
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
            createCard( data.nombre, data.precio, data.imgSrc, data.id );
        } )
        .catch( error => {
            console.error( 'Error en la solicitud POST:', error );
        } );

    // Limpia los valores del formulario después de agregar la tarjeta
    event.target.reset();
}

function createCard ( nombre, precio, imgSrc, id ) {
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
                <button class="delete-button" data-id="${id}">
                    <img src="./assets/trashIcon.svg" alt="Eliminar">
                </button>
            </div>
        </div>
    `;

    // Agrega la tarjeta al contenedor de productos
    productsContainer.appendChild( card );
    card.dataset.id = id;

    // Añade un manejador de eventos para el botón de eliminar
    const deleteButton = card.querySelector( '.delete-button' );
    deleteButton.addEventListener( 'click', () => deleteProduct( id ) );

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
// Función para eliminar un producto
const deleteProduct = async ( productId ) => {
    try {
        await fetch( `http://localhost:3000/productos/${productId}`, {
            method: 'DELETE',
        } );

        // Elimina la tarjeta del DOM
        console.log( `Eliminando producto con ID: ${productId}` );
        const cardToRemove = document.querySelector( `[data-id="${productId}"]` );

        if ( cardToRemove ) {
            cardToRemove.remove();
        }
    } catch ( error ) {

        console.error( 'Error al eliminar el producto:', error );
    }
};

// Función que renderiza los productos en la pantalla
const render = async () => {
    try {
        const listarProductos = await listaProductos();

        if ( listarProductos.length === 0 ) {
            const noProductsMessage = document.createElement( 'p' );
            noProductsMessage.textContent = 'No hay productos agregados';
            noProductsMessage.classList.add( 'no-products-message' );
            productsContainer.appendChild( noProductsMessage );
        } else {
            listarProductos.forEach( ( products ) => {
                productsContainer.appendChild(
                    createCard( products.nombre, products.precio, products.imgSrc, products.id )
                );
            } );
        }
    } catch ( error ) {
        console.log( error );
    }
};





// Asocia la función postData al evento submit del formulario
document.getElementById( 'productForm' ).addEventListener( 'submit', postData );

render()
