const BACKEND_URL = 'https://tucontrolramos-1.onrender.com';
const WHATSAPP_NUMBER = '5491137651905'; // Tu número real sin espacios ni símbolos

function pagar() {
    // Mostramos en consola que se inició el proceso
    console.log("Conectando con el servidor...");

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
        if (!res.ok) throw new Error('Respuesta de red no satisfactoria');
        return res.json();
    })
    .then(data => {
        if (data.init_point) {
            // Redirige al checkout de Mercado Pago
            window.location.href = data.init_point;
        } else {
            alert('Error: El servidor no devolvió el link de pago.');
        }
    })
    .catch(err => {
        console.error("Error detallado:", err);
        // Mensaje útil para cuando Render está "dormido"
        alert('El servidor está arrancando. Por favor, intenta de nuevo en 20-30 segundos.');
    });
}

function consultarWhatsApp() {
    const msg = encodeURIComponent("Hola, quiero consultar por un control remoto.");
    // Usamos api.whatsapp.com que es más confiable para evitar el 404
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${msg}`, '_blank');
}
