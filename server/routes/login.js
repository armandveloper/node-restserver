// Importación
const express           = require('express'),
      bcrypt            = require('bcrypt'),
      jwt               = require('jsonwebtoken'),
      {OAuth2Client}    = require('google-auth-library'),
      User              = require('../models/user');
const app = express();
// Cliente para autenticación google
const client = new OAuth2Client(process.env.CLIENT_ID);


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

// Valida el token de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post('/google', async (req, res) => {
    // Maneja la validación del token de Google
    let token = req.body.idtoken;
    let googleUser = {};
    try {
        googleUser = await verify(token);
    }
    catch (err) {
        return res.status(403).json({
            ok: false,
            err
        });
    }
    // Buscamos al usuario según el correo
    User.findOne({email: googleUser.email}, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        // Si existe el usuario 
        if (userDB) {
            // Si ya ha creado una cuenta no puede iniciar sesión con Google
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Inicie sesión con su cuenta de usuario normal'
                    }
                });
            }
            // Si no renovamos el token
            else {
                token = jwt.sign({
                    user: userDB
                }, process.env.SEED, {expiresIn: process.env.EXPIRATION_TOKEN})
                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            }
        }
        // Si no existe se guarda en db
        else {
            // Crea un objeto del modelo
            const user = new User({
                name: googleUser.name,
                email: googleUser.email,
                password: ':)',
                img: googleUser.img,
                google: googleUser.google
            });
            // Guarda la colección
            user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                // Genera un token
                token = jwt.sign({
                    user: userDB
                }, process.env.SEED, {expiresIn: process.env.EXPIRATION_TOKEN});
                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            });
        }
    });
});

module.exports = app;