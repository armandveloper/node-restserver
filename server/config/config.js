// Configurar puerto según el entorno (dev, production)
process.env.PORT = process.env.PORT || 3000;
// Configurar entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// DB
let urlDB = '';
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
}
else {
    urlDB = 'mongodb+srv://armandocruz:SOnGG4ONOb6CJApH@cluster0-usbla.mongodb.net/cafe';
}
process.env.URLDB = urlDB;