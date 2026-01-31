const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(express.json());
app.use(cors());

const client = new MercadoPagoConfig({ 
    accessToken: 'APP_USR-7601542158283775-013015-7e32bf04d70e5e82149909b3d161a18e-3166344286' 
});

app.post('/create-preference', async (req, res) => {
    try {
        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: [{
                    title: 'Control Remoto',
                    quantity: 1,
                    unit_price: 8500,
                    currency_id: 'ARS'
                }],
                back_urls: {
                    success: "https://tucontrolramos.com",
                    failure: "https://tucontrolramos.com",
                    pending: "https://tucontrolramos.com"
                },
                auto_return: "approved",
            }
        });
        res.json({ init_point: result.init_point });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => res.send('Servidor Online'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Puerto ${PORT}`));
