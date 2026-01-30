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
