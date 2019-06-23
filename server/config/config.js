// Configurar puerto según el entorno (dev, production)
process.env.PORT = process.env.PORT || 3000;
// Configurar entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// Expiración token
process.env.EXPIRATION_TOKEN = 60 * 60 * 24 * 30;
// Seed token
process.env.SEED = process.env.SEED || 'dev-seed';
// DB
let urlDB = '';
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
}
else {
    urlDB = process.env.MONGO_URL;
}
process.env.URLDB = urlDB;