const express = require('express'),
      _       = require('underscore'),
      {checkToken} = require('../middlewares/authentication');
// Importa Modelo Producto
const Product = require('../models/product');
const app = express();

// Manejo de peticiones
app.get('/productos', checkToken, (req, res) => {
    // Devuelve todos los productos
    let start = Number(req.query.start) || 0,
        limit = Number(req.query.limit) || 10;
    Product.find({available: true})
        .skip(start)
        .limit(limit)
        .populate('category_id', 'description')
        .populate('user_id', 'name email')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Product.countDocuments((err, total) => {
                if (err) throw new Error('No se pudo contar el número de colecciones', err)
                res.json({
                    ok: true,
                    total,
                    products
                });
            });
        });
});
app.get('/productos/:id', checkToken, (req, res) => {
    // Devuelve un producto filtrado por id
    Product.find({available: true, _id: req.params.id})
        .populate('category_id')
        .populate('user_id', 'name email')
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (product === null || product.length === 0) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                });
            }
            res.json({
                ok: true,
                product
            });
        });
});
app.get('/productos/buscar/:keyword', checkToken, (req, res) => {
    let regex = new RegExp(req.params.keyword, 'i');
    Product.find({name: regex})
        .populate('category_id', 'description')
        .exec((err, results) => {
            if (err) {
                return res.status(500).json({
                    ok: true,
                    err
                });
            }
            res.json({
                ok: true,
                results
            });
        });
});
app.post('/productos', checkToken, (req, res) => {
    // Crea un nuevo producto
    let product = new Product({
        name: req.body.name,
        priceUnit: req.body.priceUnit,
        description: req.body.description,
        available: req.body.available,
        category_id: req.body.categoryId,
        user_id: req.user._id
    });
    product.save((err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            product: productDB
        });
    });
});
app.put('/productos/:id', checkToken, (req, res) => {
    // Actualiza un producto
    let product = _.pick(req.body, ['name', 'priceUnit', 'description', 'available']);
    Product.findByIdAndUpdate(req.params.id, product, {new: true, runValidators: true}, (err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            product: productDB
        });
    });
});
app.delete('/productos/:id', checkToken, (req, res) => {
    // Elimina un producto (Cambia el estado disponible a false)
    Product.findByIdAndUpdate(req.params.id, {available: false}, {new: true}, (err, product) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            product
        });
    });
});

module.exports = app;