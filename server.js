// ============================================
// BACKEND PARA MERCADO PAGO - NODE.JS (RENDER)
// ============================================




const mercadopago = require('mercadopago');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// CONFIGURACIÓN MERCADO PAGO (ENV)
// ============================================
const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!MERCADOPAGO_ACCESS_TOKEN) {
    console.error('❌ FALTA MERCADOPAGO_ACCESS_TOKEN EN ENV');
    process.exit(1);
}

mercadopago.configure({
    access_token: MERCADOPAGO_ACCESS_TOKEN
});

// ============================================
// MIDDLEWARES
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ============================================
// RUTA RAÍZ (PARA EVITAR PÁGINA EN BLANCO)
// ============================================
app.get('/', (req, res) => {
    res.send('✅ Backend Mercado Pago activo');
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        time: new Date().toISOString()
    });
});

// ============================================
// CREAR PREFERENCIA DE PAGO
// ============================================
app.post('/create-preference', async (req, res) => {
    try {
        const { items, payer } = req.body;

        if (!items || !items.length) {
            return res.status(400).json({ error: 'Items requeridos' });
        }

        const preference = {
            items: items.map(item => ({
                title: item.title,
                description: item.description || '',
                quantity: Number(item.quantity),
                unit_price: Number(item.unit_price),
                currency_id: 'ARS'
            })),
            payer: {
                email: payer?.email || 'test@test.com'
            },
            back_urls: {
                success: 'https://googlee2.github.io/TuControlRamos/?status=success',
                failure: 'https://googlee2.github.io/TuControlRamos/?status=failure',
                pending: 'https://googlee2.github.io/TuControlRamos/?status=pending'
            },
            auto_return: 'approved',
            external_reference: `ORDER-${Date.now()}`,
            notification_url: 'https://tucontrolramos-1.onrender.com/webhook'
        };

        const response = await mercadopago.preferences.create(preference);

        res.json({
            id: response.body.id,
            init_point: response.body.init_point
        });

    } catch (error) {
        console.error('❌ Error Mercado Pago:', error);
        res.status(500).json({
            error: 'Error al crear preferencia'
        });
    }
});

// ============================================
// WEBHOOK
// ============================================
app.post('/webhook', async (req, res) => {
    try {
        console.log('🔔 Webhook recibido:', req.body);
        res.sendStatus(200);
    } catch (err) {
        console.error('❌ Webhook error:', err);
        res.sendStatus(500);
    }
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
    console.log('╔══════════════════════════════════════╗');
    console.log('║ 🚀 SERVIDOR MERCADO PAGO ACTIVO     ║');
    console.log('╚══════════════════════════════════════╝');
    console.log(`🌐 Puerto: ${PORT}`);
    console.log(`🔑 Access Token: ✅`);
});
