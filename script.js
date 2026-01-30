/********************************
 * CONFIGURACIÓN GITHUB
 ********************************/
const owner = "googlee2"; // ← tu usuario real
const repo = "TuControlRamos"; // nombre exacto del repo
const carpeta = "images"; // carpeta donde se guardan las imágenes

/********************************
 * SUBIR IMAGEN A GITHUB
 ********************************/
async function subirImagen() {
  const fileInput = document.getElementById("fileInput");
  const tokenInput = document.getElementById("token");

  const archivo = fileInput.files[0];
  const token = tokenInput.value.trim();

  // Validaciones
  if (!archivo) {
    alert("No se seleccionó ningún archivo");
    return;
  }

  if (!token) {
    alert("El token está vacío");
    return;
  }

  try {
    // Convertir archivo a base64
    const buffer = await archivo.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(buffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );

    const nombreArchivo = Date.now() + "_" + archivo.name;

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${carpeta}/${nombreArchivo}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `token ${token}`,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Subida de imagen desde la web",
        content: base64
      })
    });

    const texto = await response.text();
    console.log("STATUS:", response.status);
    console.log("RESPUESTA:", texto);

    if (response.ok) {
      alert("Imagen subida correctamente ✅");
      fileInput.value = "";
      cargarGaleria();
    } else {
      alert("Error al subir imagen ❌ (mirá la consola)");
    }

  } catch (error) {
    console.error(error);
    alert("Error inesperado");
  }
}

/********************************
 * CARGAR GALERÍA DE IMÁGENES
 ********************************/
async function cargarGaleria() {
  const galeria = document.getElementById("galeria");
  galeria.innerHTML = "Cargando imágenes...";

  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${carpeta}`;
    const res = await fetch(url);
    const data = await res.json();

    galeria.innerHTML = "";

    if (!Array.isArray(data)) {
      galeria.innerHTML = "No hay imágenes todavía";
      return;
    }

    data.forEach(item => {
      if (item.type === "file") {
        const img = document.createElement("img");
        img.src = item.download_url;
        img.style.width = "150px";
        img.style.margin = "10px";
        img.style.borderRadius = "8px";
        galeria.appendChild(img);
      }
    });

  } catch (error) {
    console.error(error);
    galeria.innerHTML = "Error al cargar la galería";
  }
}

/********************************
 * CARGA INICIAL
 ********************************/
cargarGaleria();
const BACKEND_URL = 'https://tucontrolramos-1.onrender.com';

function pagar() {
  fetch(`${BACKEND_URL}/create-preference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{
        title: 'Control remoto',
        quantity: 1,
        unit_price: 8500
      }]
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.init_point) {
      window.location.href = data.init_point;
    } else {
      alert('No se pudo iniciar el pago');
    }
  })
  .catch(err => {
    console.error(err);
    alert('Error de conexión');
  });
}
