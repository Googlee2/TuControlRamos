// ============================================
// BACKEND PARA MERCADO PAGO - NODE.JS
// ============================================

const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');

const app = express();
const PORT = process.env.PORT || 3000;

// ⚙️ CONFIGURACIÓN - COLOCA TU ACCESS TOKEN AQUÍ
const MERCADOPAGO_ACCESS_TOKEN = 'APP_USR-5281050459713526-012817-a48f51cb9596a45449ddf2ff3982a966-3166344286';

// Configurar Mercado Pago
mercadopago.configure({
    access_token: MERCADOPAGO_ACCESS_TOKEN
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logs para debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ============================================
// RUTA: CREAR PREFERENCIA DE PAGO
// ============================================
app.post('/create-preference', async (req, res) => {
    try {
        const { items, payer, back_urls } = req.body;

        console.log('📦 Creando preferencia de pago...');
        console.log('Items recibidos:', JSON.stringify(items, null, 2));

        const preference = {
            items: items.map(item => ({
                title: item.title,
                description: item.description || '',
                quantity: parseInt(item.quantity),
                unit_price: parseFloat(item.unit_price),
                currency_id: item.currency_id || 'ARS'
            })),
            payer: {
                email: payer?.email || 'test@test.com',
                name: payer?.name || '',
                surname: payer?.surname || '',
                phone: {
                    area_code: payer?.phone?.area_code || '',
                    number: payer?.phone?.number || ''
                }
            },
            back_urls: {
                success: back_urls?.success || `${req.headers.origin}?status=success`,
                failure: back_urls?.failure || `${req.headers.origin}?status=failure`,
                pending: back_urls?.pending || `${req.headers.origin}?status=pending`
            },
            auto_return: 'approved',
            statement_descriptor: 'TUCONTROLRAMOS',
            external_reference: `ORDER-${Date.now()}`,
            notification_url: `${req.headers.origin}/webhook`,
            payment_methods: {
                excluded_payment_types: [],
                installments: 12
            },
            shipments: {
                mode: 'not_specified'
            }
        };

        const response = await mercadopago.preferences.create(preference);
        
        console.log('✅ Preferencia creada exitosamente');
        console.log('Preference ID:', response.body.id);

        res.json({
            id: response.body.id,
            init_point: response.body.init_point,
            sandbox_init_point: response.body.sandbox_init_point
        });

    } catch (error) {
        console.error('❌ Error al crear preferencia:', error);
        res.status(500).json({
            error: 'Error al crear preferencia de pago',
            message: error.message,
            details: error.response?.data || error
        });
    }
});

// ============================================
// RUTA: WEBHOOK PARA NOTIFICACIONES IPN
// ============================================
app.post('/webhook', async (req, res) => {
    try {
        const { type, data } = req.body;
        console.log('🔔 Webhook recibido:', { type, data });

        if (type === 'payment') {
            const payment = await mercadopago.payment.get(data.id);
            console.log('💳 Estado del pago:', payment.body.status);
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('❌ Error en webhook:', error);
        res.status(500).send('Error');
    }
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString()
    });
});

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════╗');
    console.log('║   🚀 SERVIDOR MERCADO PAGO ACTIVO     ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`📍 Puerto: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🔑 Access Token: ${MERCADOPAGO_ACCESS_TOKEN ? '✅' : '❌'}`);
});
