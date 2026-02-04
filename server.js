const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(express.json());
app.use(cors());

const client = new MercadoPagoConfig({ 
    accessToken: 'ACAAAAAAAAAAAA  B BOLUDOOOOOOOOOOOOOOOOOO' 
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
