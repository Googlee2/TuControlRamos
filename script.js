const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(express.json());
app.use(cors());

// Reemplaza esto con tu Access Token real de Mercado Pago
const client = new MercadoPagoConfig({ 
    accessToken: APP_USR-7601542158283775-013015-7e32bf04d70e5e82149909b3d161a18e-3166344286'' 
});

app.post('/create-preference', async (req, res) => {
    try {
        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: req.body.items,
                auto_return: "approved",
            }
        });
        res.json({ init_point: result.init_point });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error en el servidor");
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
