const RUTA_IMAGENES = "../assets/img/";

function obtenerCarrito() {
  try {
    const datosGuardados = localStorage.getItem("carrito");
    return datosGuardados ? JSON.parse(datosGuardados) : [];
  } catch (error) {
    console.error("Error al leer el carrito:", error);
    return [];
  } finally {
    console.log("Lectura del carrito finalizada");
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function crearFilaCarrito(item) {
  const { id, nombre, precio, cantidad, imagen, categoria } = item;
  const etiquetaCantidad = categoria === "apadrinamiento" ? "meses" : "unidades";
  const subtotal = precio * cantidad;

  const fila = document.createElement("div");
  fila.className = "card";

  fila.innerHTML = `
    <img src="${RUTA_IMAGENES}${imagen}" alt="${nombre}">
    <h3>${nombre}</h3>
    <p>${cantidad} ${etiquetaCantidad} x $${precio}</p>
    <p class="card-precio">Subtotal: $${subtotal}</p>
    <button class="btn-eliminar">Eliminar</button>
  `;

  const botonEliminar = fila.querySelector(".btn-eliminar");
  botonEliminar.addEventListener("click", () => eliminarDelCarrito(id));

  return fila;
}

function renderizarCarrito() {
  const carrito = obtenerCarrito();
  const contenedorCarrito = document.getElementById("contenedor-carrito");
  const mensajeVacio = document.getElementById("carrito-vacio");
  const totalCarrito = document.getElementById("total-carrito");

  contenedorCarrito.innerHTML = "";

  carrito.length === 0
    ? (mensajeVacio.style.display = "block")
    : (mensajeVacio.style.display = "none");

  carrito.forEach((item) => {
    contenedorCarrito.appendChild(crearFilaCarrito(item));
  });

  const total = carrito.reduce((acumulado, item) => acumulado + item.precio * item.cantidad, 0);
  totalCarrito.textContent = `$${total}`;
}

function eliminarDelCarrito(idProducto) {
  const carrito = obtenerCarrito();
  const carritoActualizado = carrito.filter((item) => item.id !== idProducto);

  guardarCarrito(carritoActualizado);
  renderizarCarrito();

  Toastify({
    text: "Producto eliminado del carrito",
    duration: 2500,
    gravity: "top",
    position: "left",
  }).showToast();
}

const botonVaciar = document.getElementById("btn-vaciar");

botonVaciar.addEventListener("click", () => {
  guardarCarrito([]);
  renderizarCarrito();

  Toastify({
    text: "Carrito vaciado",
    duration: 2500,
    gravity: "top",
    position: "left",
  }).showToast();
});

const botonConfirmar = document.getElementById("btn-confirmar");

botonConfirmar.addEventListener("click", () => {
  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    Toastify({
      text: "Todavía no agregaste nada al carrito",
      duration: 3000,
      gravity: "top",
      position: "left",
    }).showToast();
    return;
  }

  localStorage.removeItem("carrito");
  renderizarCarrito();

  Toastify({
    text: "¡Gracias por tu colaboración con el refugio!",
    duration: 4000,
    gravity: "top",
    position: "left",
  }).showToast();
});

renderizarCarrito();
