// Importación Módulos
require('./config/config');
const express           = require('express'),
      bodyParser        = require('body-parser'),
      mongoose          = require('mongoose');
// Instanciacion
const app = express();


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Configuración global de rutas
app.use(require('./routes/index'));

// Conexión con DB
mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useCreateIndex: true},(err) => {
    if (err) throw new Error(err)
    console.log('Se ha establecido la conexión con la DB en', process.env.URLDB);
});


app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
});