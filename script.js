function cargarCarrito() {
    let data = localStorage.getItem("carrito");
    return data ? JSON.parse(data) : [];
}

function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}


let carrito = cargarCarrito();

function productoClick(nombre, precio) {
    let producto = carrito.find(p => p.nombre === nombre);

    if (producto) {
        producto.cantidad++;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
    mostrarMensaje(nombre + " agregado al carrito");
}
function verCarrito() {
    let texto = "CARRITO:\n\n";

    carrito.forEach(p => {
        texto += `${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}\n`;
    });

    alert(texto);
}
function generarPDF() {
    // 👉 leer datos del cliente
    let nombre = document.getElementById("clienteNombre").value.trim();
    let telefono = document.getElementById("clienteTelefono").value.trim();
    let provincia = document.getElementById("clienteProvincia").value.trim();
    let direccion = document.getElementById("clienteDireccion").value.trim();
    let hoy = new Date();
    let fecha = hoy.toLocaleDateString("es-AR");

    // 👉 VALIDACIONES
    if (nombre === "") {
        mostrarMensaje("Por favor ingresá tu nombre");
        return;
    }

    if (telefono === "") {
        mostrarMensaje("Por favor ingresá tu teléfono");
        return;
    }

    if (provincia === "") {
        mostrarMensaje("Por favor ingresá tu Provincia");
        return;
    }

    if (direccion === "") {
        mostrarMensaje("Por favor ingresá tu Dirección");
        return;
    }

    if (carrito.length === 0) {
        mostrarMensaje("El carrito está vacío");
        return;
    }

    // 👉 si todo está bien, recién ahora creamos el PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    let y = 15;

    pdf.setFontSize(16);
    pdf.text("PEDIDO", 10, y);
    y += 10;
    pdf.setFontSize(10);
    pdf.text("Fecha: " + fecha, 160, 23);

    pdf.setFontSize(11);
    pdf.text("Cliente: " + nombre, 10, y);
    y += 7;
    pdf.text("Teléfono: " + telefono, 10, y);
    y += 8;
    pdf.text("Provincia: " + provincia, 10, y);
    y += 9;
    pdf.text("Dirección: " + direccion, 10, y);
    y += 10;

    pdf.text("Productos:", 10, y);
    y += 8;

    carrito.forEach(p => {
        pdf.text(
            `${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}`,
            10,
            y
        );
        y += 7;
    });

    y += 3;
    pdf.line(10, y, 200, y);
    y += 8;

    let total = carrito.reduce(
        (sum, p) => sum + p.precio * p.cantidad,
        0
    );

    pdf.text("TOTAL: $" + total, 10, y);

    pdf.save("pedido.pdf");
}
function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem("carrito");
    actualizarContador();
}

function enviarWhatsApp() {
    let nombre = document.getElementById("clienteNombre").value.trim();
    let telefono = document.getElementById("clienteTelefono").value.trim();
    let provincia = document.getElementById("clienteProvincia").value.trim();
    let direccion = document.getElementById("clienteDireccion").value.trim();

    if (!nombre || !telefono || !provincia || !direccion || carrito.length === 0) {
        mostrarMensaje("Completá los datos y agregá productos");
        return;
    }

    generarPDF();

    let mensaje = `Nuevo pedido%0ADe: ${nombre}, ${provincia}%0ATel: ${telefono}`;

    let numeroNegocio = "5491128884710";
    let url = `https://wa.me/${numeroNegocio}?text=${mensaje}`;

    window.open(url, "_blank");

    vaciarCarrito();

    mostrarMensaje("Pedido enviado correctamente");
}
function mostrarMensaje(texto) {
    let mensaje = document.getElementById("mensaje");
    if (!mensaje) return;

    mensaje.textContent = texto;
    mensaje.classList.add("activo");

    setTimeout(() => {
        mensaje.classList.remove("activo");
    }, 2500);
}
