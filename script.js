// =====================
// CARRITO (STORAGE)
// =====================
function cargarCarrito() {
    let data = localStorage.getItem("carrito");
    return data ? JSON.parse(data) : [];
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

let carrito = cargarCarrito();

// =====================
// PRODUCTOS
// =====================
function productoClick(nombre, precio) {
    let producto = carrito.find(p => p.nombre === nombre);

    if (producto) {
        producto.cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }

    guardarCarrito();
    mostrarMensaje(nombre + " agregado al carrito");
    actualizarContador();
    mostrarCarrito();
}

// =====================
// CARRITO EN PANTALLA
// =====================
function mostrarCarrito() {
    let contenedor = document.getElementById("carrito");
    if (!contenedor) return;

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío</p>";
        return;
    }

    let html = "<ul>";
    let total = 0;

    carrito.forEach((p, index) => {
        let subtotal = p.precio * p.cantidad;
        total += subtotal;

        html += `
            <li>
                <strong>${p.nombre}</strong><br>
                $${p.precio} x ${p.cantidad}<br>
                <button onclick="cambiarCantidad(${index}, -1)">➖</button>
                <button onclick="cambiarCantidad(${index}, 1)">➕</button>
                <span> Subtotal: $${subtotal}</span>
            </li>
            <hr>
        `;
    });

    html += `</ul><p>Total: $${total}</p>`;
    contenedor.innerHTML = html;
}

function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;

    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }

    guardarCarrito();
    mostrarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem("carrito");
    mostrarCarrito();
    mostrarMensaje("Carrito vacío");
}

// =====================
// MENSAJES
// =====================
function mostrarMensaje(texto) {
    let mensaje = document.getElementById("mensaje");
    if (!mensaje) return;

    mensaje.textContent = texto;
    mensaje.classList.add("activo");

    setTimeout(() => {
        mensaje.classList.remove("activo");
    }, 2500);
}

// =====================
// WHATSAPP + PDF
// =====================
function generarPDF() {
    if (carrito.length === 0) return;

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    let y = 15;
    pdf.setFontSize(16);
    pdf.text("PEDIDO", 10, y);
    y += 10;

    carrito.forEach(p => {
        pdf.text(`${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}`, 10, y);
        y += 7;
    });

    pdf.save("pedido.pdf");
}

function enviarWhatsApp() {
    if (carrito.length === 0) {
        mostrarMensaje("El carrito está vacío");
        return;
    }

    generarPDF();

    let mensaje = "Nuevo pedido";
    let url = `https://wa.me/5491128884710?text=${mensaje}`;
    window.open(url, "_blank");

    vaciarCarrito();
    mostrarMensaje("Pedido enviado correctamente");
}

// =====================
// INIT
// =====================
document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito();
});