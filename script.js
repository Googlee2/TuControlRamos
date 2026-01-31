const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(express.json());
app.use(cors());

// Aquí usamos la variable que configuraste en Render
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_TOKEN 
});

app.post('/create-preference', async (req, res) => {
    try {
        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: [{
                    title: 'Control Remoto - TuControlRamos',
                    quantity: 1,
                    unit_price: 8500, // Ajustá el precio si hace falta
                    currency_id: 'ARS'
                }],
                back_urls: {
                    success: "https://tucontrolramos.com", // Cambiá por tu web real
                    failure: "https://tucontrolramos.com",
                    pending: "https://tucontrolramos.com"
                },
                auto_return: "approved",
            }
        });
        
        // Enviamos el link de pago al frontend
        res.json({ init_point: result.init_point });
    } catch (error) {
        console.error("Error al crear preferencia:", error);
        res.status(500).json({ error: error.message });
    }
});

// Ruta simple para verificar que el servidor vive
app.get('/', (req, res) => res.send('Servidor de TuControlRamos Online'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
