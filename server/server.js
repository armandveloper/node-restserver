// Importación Módulos
require('./config/config');
const express           = require('express'),
      bodyParser        = require('body-parser');
// Instanciacion
const app = express();


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Resolución peticiones
app.get('/usuarios', (req, res) => {
    res.json('Usuario devuelto');
});
app.post('/usuarios', (req, res) => {
    const person = req.body;
    if (person.nombre === undefined) {
        res.status(400)
           .json({
                ok: false,
                message: 'El nombre es necesario'
            });
    }
    else {
        res.status(200)
           .json(person);
    }
});
app.put('/usuarios', (req, res) => {
    res.json('Usuario Actualizado');
});
app.delete('/usuarios', (req, res) => {
    res.json('Usuario eliminado');
});



app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
});