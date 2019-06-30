const express = require('express'),
      _       = require('underscore');
const {checkToken, checkRole} = require('../middlewares/authentication');
const app = express();
// Importa modelo categoría
const Category = require('../models/category');

// Manejo de peticiones
app.get('/categoria', checkToken, (req, res) => {
    // Devuelve todas las categorías
    Category.find({})
        .sort('description')
        .populate('user_id', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categories
            });
        });
});
app.get('/categoria/:id', checkToken, (req, res) => {
    // Devuelve una categoría filtrada por id
    Category.findById(req.params.id, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (categoryDB === null) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'La categoría no existe'
                }
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    });
});
app.post('/categoria', checkToken, (req, res) => {
    // Crea nueva categoría
    let category = new Category({
        description: req.body.description,
        user_id: req.user._id
    });
    // Guarda la categoría en la db
    category.save((err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    });
});
app.put('/categoria/:id', checkToken, (req, res) => {
    // Actualiza una categoría por id
    let id = req.params.id;
    let category = _.pick(req.body, ['description']);
    Category.findByIdAndUpdate(id, category, {new: true, runValidators: true}, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    });
});
app.delete('/categoria/:id', [checkToken, checkRole], (req, res) => {
    // Elimina una categoría
    Category.findByIdAndRemove(req.params.id, (err, categoryDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (categoryDeleted === null) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            category: categoryDeleted
        });
    });
});


module.exports = app;