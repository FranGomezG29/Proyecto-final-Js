const RUTA_IMAGENES = "./assets/img/";
let productos = [];

async function obtenerProductos() {
  try {
    const respuesta = await fetch("./data/productos.json");

    if (!respuesta.ok) {
      throw new Error("No se pudo obtener el catálogo de productos");
    }

    productos = await respuesta.json();
    renderizarCatalogo();

    Toastify({
      text: "Catálogo cargado con éxito",
      duration: 3000,
      gravity: "top",
      position: "left",
    }).showToast();
  } catch (error) {
    console.error("Error al cargar el catálogo:", error);

    Toastify({
      text: "No se pudo cargar el catálogo, intentá recargar la página",
      duration: 4000,
      gravity: "top",
      position: "left",
    }).showToast();
  } finally {
    document.getElementById("cargando-apadrinamiento")?.remove();
    document.getElementById("cargando-insumos")?.remove();
  }
}

function crearTarjetaProducto(producto) {
  const { id, nombre, descripcion, precio, imagen, categoria } = producto;
  const etiquetaCantidad = categoria === "apadrinamiento" ? "Meses" : "Cantidad";

  const tarjeta = document.createElement("div");
  tarjeta.className = "card";

  tarjeta.innerHTML = `
    <img src="${RUTA_IMAGENES}${imagen}" alt="${nombre}">
    <h3>${nombre}</h3>
    <p class="card-descripcion">${descripcion}</p>
    <p class="card-precio">$${precio} ${categoria === "apadrinamiento" ? "por mes" : ""}</p>
    <label class="card-cantidad-label">
      ${etiquetaCantidad}
      <input type="number" class="input-cantidad" min="1" value="1">
    </label>
    <button class="btn-agregar">Agregar al carrito</button>
  `;

  const inputCantidad = tarjeta.querySelector(".input-cantidad");
  const botonAgregar = tarjeta.querySelector(".btn-agregar");

  botonAgregar.addEventListener("click", () => {
    const cantidadSeleccionada = Number(inputCantidad.value);
    agregarAlCarrito(id, cantidadSeleccionada);
  });

  return tarjeta;
}

function renderizarCatalogo(listaProductos = productos) {
  const contenedorApadrinamiento = document.getElementById("contenedor-apadrinamiento");
  const contenedorInsumos = document.getElementById("contenedor-insumos");

  contenedorApadrinamiento.innerHTML = "";
  contenedorInsumos.innerHTML = "";

  const animalesParaApadrinar = listaProductos.filter((producto) => producto.categoria === "apadrinamiento");
  const insumosDisponibles = listaProductos.filter((producto) => producto.categoria === "insumo");

  animalesParaApadrinar.forEach((producto) => {
    contenedorApadrinamiento.appendChild(crearTarjetaProducto(producto));
  });

  insumosDisponibles.forEach((producto) => {
    contenedorInsumos.appendChild(crearTarjetaProducto(producto));
  });
}

function agregarAlCarrito(idProducto, cantidad) {
  const productoSeleccionado = productos.find((producto) => producto.id === idProducto);

  if (!productoSeleccionado || cantidad < 1) {
    return;
  }

  const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
  const itemExistente = carritoActual.find((item) => item.id === idProducto);

  itemExistente
    ? itemExistente.cantidad += cantidad
    : carritoActual.push({ ...productoSeleccionado, cantidad });

  localStorage.setItem("carrito", JSON.stringify(carritoActual));

  Toastify({
    text: `${productoSeleccionado.nombre} agregado al carrito`,
    duration: 2500,
    gravity: "top",
    position: "left",
  }).showToast();
}

const buscador = document.getElementById("input-buscar");

buscador.addEventListener("keyup", () => {
  const textoBuscado = buscador.value.toLowerCase();
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(textoBuscado),
  );

  renderizarCatalogo(productosFiltrados);
});

obtenerProductos();
