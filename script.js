/* ==============================
    CONFIGURACIÓN
============================== */
const BACKEND_URL = 'https://tucontrolramos-1.onrender.com';
const WHATSAPP_NUMBER = '5491137651905'; // Tu número real corregido

/* ==============================
    MERCADO PAGO
============================== */
function pagar() {
    console.log("Conectando con el servidor en Render...");
    
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
    .then(res => {
        if (!res.ok) throw new Error('Error en el servidor');
        return res.json();
    })
    .then(data => {
        if (data.init_point) {
            // Abre la pasarela de pago de Mercado Pago
            window.location.href = data.init_point;
        } else {
            alert('El servidor no devolvió el link de pago. Revisá tu Access Token.');
        }
    })
    .catch(err => {
        console.error("Error detallado:", err);
        // Mensaje amigable por si Render está arrancando (típico en plan gratuito)
        alert('El servidor está arrancando. Por favor, esperá 20 segundos e intentá de nuevo.');
    });
}

/* ==============================
    WHATSAPP
============================== */
function consultarWhatsApp() {
    const msg = encodeURIComponent("Hola, quiero consultar por un control remoto.");
    // Usamos api.whatsapp.com para máxima compatibilidad
    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${msg}`;
    window.open(url, '_blank');
}
