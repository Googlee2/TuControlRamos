const BACKEND_URL = 'https://tucontrolramos-1.onrender.com';
const WHATSAPP_NUMBER = '5491137651905'; // Tu número real corregido

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
    .then(res => {
        if (!res.ok) throw new Error('Error en el servidor');
        return res.json();
    })
    .then(data => {
        if (data.init_point) {
            window.location.href = data.init_point;
        } else {
            alert('No se pudo iniciar el pago. Revisá los logs del backend.');
        }
    })
    .catch(err => {
        console.error(err);
        alert('Error de conexión. El servidor de Render podría estar arrancando, intentá de nuevo en 30 segundos.');
    });
}

function consultarWhatsApp() {
    const msg = encodeURIComponent("Hola, quiero consultar por un control remoto");
    // Usamos api.whatsapp.com para evitar el error 404
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${msg}`, '_blank');
}
