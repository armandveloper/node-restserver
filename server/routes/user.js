// Importación modulos
const express               = require('express'),
      // Módulo para cifrado  
      bcrypt                = require('bcrypt'),
      // Módulo para proveer más funcionalidad: como filtrar datos   
      _                     = require('underscore'),
      User                  = require('../models/user');

const app = express();
const {checkToken, checkRole} = require('../middlewares/authentication');

// Resolución peticiones
app.get('/usuario', checkToken, (req, res) => {
    let start = Number(req.query.start) || 0,
        limit = Number(req.query.limit) || 5;
        // Busca en una colección (tabla) según un criterio
        // El segundo argumento especifica los campos a seleccionar (SELECT)
    User.find({state: true}, 'name email role state google img')
        .skip(start)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            // Devuelve el número de documentos (filas en SQL)
            User.countDocuments({state: true}, (err, total) => {
                if (err) throw new Error('Ha surgido el error', err)
                res.json({
                    ok: true,
                    total,
                    users
                });
            });
        });
});
app.post('/usuario', [checkToken, checkRole], (req, res) => {
    const person = req.body;
    // Crea nueva instancia del modelo (objeto) de usuario y asigna valores
    let user = new User({
        name: person.name,
        email: person.email,
        // Cifra password 
        password: bcrypt.hashSync(person.password, 10),
        role: person.role
    });
    // Guarda usuario en la db usando el orm
    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });
});
app.put('/usuario/:id', [checkToken, checkRole], (req, res) => {
    let id = req.params.id;
    // Filtra valores enviados
    let person = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);
    // Actualiza un registro
    User.findByIdAndUpdate(id, person, {new: true, runValidators: true}, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: userDB 
        });
    });
});
// Método 1: eliminando físicamente
// app.delete('/usuario/:id', (req, res) => {
//     let {id} = req.params;
//     User.findByIdAndRemove(id, (err, userDeleted) => {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             });
//         }
//         if (userDeleted === null) {
//             return res.status(404).json({
//                 ok: false,
//                 err: {
//                     message: 'Usuario no encontrado'
//                 }
//             });
//         }
//         res.json({
//             ok: true,
//             user: userDeleted
//         });
//     });
// });
// Método 2: cambiando el estado a inactivo
app.delete('/usuario/:id', [checkToken, checkRole], (req, res) => {
    let {id} = req.params;
    // Solo pasa una propiedad: el estado 
    User.findByIdAndUpdate(id, {state: false}, {new: true}, (err, user) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user
        });
    });
});



module.exports = app;