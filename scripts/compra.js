const compra = new Carrito();
const listaCompra = document.querySelector('#lista-compra tbody');
const carrito2 = document.getElementById('carrito');
const procesarCompraBtn = document.getElementById('procesar-compra');
const cliente = document.getElementById('cliente');
const correo = document.getElementById('correo');

cargarEventos();
/**
 * Asocia eventos a elementos del DOM al cargar la página.
 * - Evento 'DOMContentLoaded': Lee el carrito desde el almacenamiento local.
 * - Evento de clic en 'carrito2': Elimina productos del carrito.
 * - Calcula el total de la compra.
 * - Evento de clic en 'procesarCompraBtn': Inicia el proceso de compra.
 */
function cargarEventos(){
    document.addEventListener('DOMContentLoaded', compra.leerLocalStorageCompra());
    carrito2.addEventListener('click', (e)=>{compra.eliminarProducto(e)});
    compra.calcularTotal();
    procesarCompraBtn.addEventListener('click', procesarCompra);
}
/**
 * Maneja la lógica de procesar una compra.
 * - Verifica la existencia de productos en el carrito.
 * - Verifica la introducción de datos del cliente.
 * - Inicializa 'emailjs' y envía el formulario de compra.
 * - Muestra mensajes de error o éxito usando 'SweetAlert'.
 * - Vacía el carrito y redirige a la página de productos después de una compra exitosa.
 * @param {Event} e - Evento que desencadena la función (clic en 'procesarCompraBtn').
 */
function procesarCompra(e){
    //e.preventDefault();
    if(compra.obtenerProductosLocalStorage().length === 0){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No hay productos, selecciona alguno',
            timer: 2500,
            showConfirmButton: false
          }).then(function(){
              window.location = "productos.html";
          })
    }
    else if(cliente.value === '' || correo.value === ''){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ingrese todos los campos requeridos',
            timer: 2500,
            showConfirmButton: false
          })
    }
    else{
        emailjs.init('user_hx2rYaxbexZ0qlT8bs771')

        const btn = document.getElementById('procesar-compra');

        document.getElementById('procesar-pago')
        .addEventListener('submit', function(event) {
        event.preventDefault();

            const cargandoGif = document.querySelector('#cargando');
            cargandoGif.style.display='block';

            const enviado = document.createElement('img');
            enviado.src = 'assets/img/mail.gif';
            enviado.style.display = 'block';
            enviado.width = '150';

        const serviceID = 'default_service';
        const templateID = 'template_rtfpoq5';

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
            
                    cargandoGif.style.display = 'none';
                    document.querySelector('#loaders').appendChild(enviado);
                    setTimeout(() => {
                        enviado.remove();
                        compra.vaciarLocalStorage();
                        window.location = "productos.html";
                    }, 2500);

            }, (err) => {
            btn.value = 'Send Email';
            alert(JSON.stringify(err));
            });
        });

    }
}
