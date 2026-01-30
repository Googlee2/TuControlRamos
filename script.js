const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(express.json());
app.use(cors());

// CONFIGURACIÓN DE MERCADO PAGO (PRODUCCIÓN)
const client = new MercadoPagoConfig({ 
    accessToken: 'APP_USR-3780959652238615-013015-0209af9b3a80a7739fee04c29024cef7-461844898' 
});

app.post('/create-preference', async (req, res) => {
    try {
        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: [
                    {
                        id: 'control-001',
                        title: 'Control Remoto',
                        quantity: 1,
                        unit_price: 8500,
                        currency_id: 'ARS' // Obligatorio para Argentina
                    }
                ],
                back_urls: {
                    success: "https://tucontrolramos.com",
                    failure: "https://tucontrolramos.com",
                    pending: "https://tucontrolramos.com"
                },
                auto_return: "approved",
                statement_descriptor: "TUCONTROLRAMOS" // Cómo aparecerá en el resumen de la tarjeta
            }
        });

        // IMPORTANTE: Enviamos el init_point
        res.json({ init_point: result.init_point });
    } catch (error) {
        console.error("Error detallado de MP:", error);
        res.status(500).json({ 
            error: 'Error al crear el pago',
            detalles: error.message 
        });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor de Producción en puerto ${PORT}`));
