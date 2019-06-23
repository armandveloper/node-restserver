// Importación
const express       = require('express'),
      bcrypt        = require('bcrypt'),
      jwt           = require('jsonwebtoken'),
      User          = require('../models/user');
const app = express();


// Resolución peticiones
app.post('/login', (req, res) => {
    const body = req.body;
    User.findOne({email: body.email}, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (! userDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Correo o contraseña incorrecta'
                }
            });
        }
        // Validando contraseña
        if (! bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Correo o contraseña incorrecta'
                }
            });
        }
        const token = jwt.sign({
            user: userDB
        }, process.env.SEED, {expiresIn: process.env.EXPIRATION_TOKEN});
        res.json({
            ok: true,
            user: userDB,
            token
        });
    });
});


module.exports = app;