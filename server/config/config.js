// Configurar puerto según el entorno (dev, production)
process.env.PORT = process.env.PORT || 3000;
// Configurar entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// Expiración token
process.env.EXPIRATION_TOKEN = '48h';
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

// Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '1028312886907-5rbikmegu4g6frj9hg2ij492rmb83gfp.apps.googleusercontent.com';