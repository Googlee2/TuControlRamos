const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();

// Configuración de Middlewares
app.use(express.json());
app.use(cors());

// CONFIGURACIÓN DE MERCADO PAGO
// Reemplaza 'TU_ACCESS_TOKEN_REAL' por tu token de producción (empieza con APP_USR-)
const client = new MercadoPagoConfig({ 
    accessToken: 'APP_USR-7601542158283775-013015-7e32bf04d70e5e82149909b3d161a18e-3166344286' 
});

// Ruta para crear la preferencia de pago
app.post('/create-preference', async (req, res) => {
    try {
        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: req.body.items,
                back_urls: {
                    success: "https://tucontrolramos.com", // Pon tu web aquí
                    failure: "https://tucontrolramos.com",
                    pending: "https://tucontrolramos.com"
                },
                auto_return: "approved",
            }
        });

        // Enviamos el link de pago (init_point) al frontend
        res.json({ init_point: result.init_point });
    } catch (error) {
        console.error("Error en Mercado Pago:", error);
        res.status(500).json({ error: 'No se pudo crear el pago' });
    }
});

// Ruta de prueba para verificar que el servidor está online
app.get('/', (req, res) => {
    res.send('Servidor de TuControlRamos funcionando correctamente.');
});

// Puerto dinámico para Render (importante)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});
