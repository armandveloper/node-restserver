const express = require('express'),
      fileupload = require('express-fileupload'),
      fs = require('fs'),
      path = require('path');
const User = require('../models/user'),
      Product = require('../models/product');
const app = express();

app.use(fileupload());


function deleteImage(name, category) {
    // Elimina una anterior imagen del servidor
    let pathImg = path.resolve(__dirname, `../../uploads/${category}/${name}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

function updateUserImage(id, res, fileName) {
    User.findById(id, (err, user) => {
        if (err) {
            deleteImage(fileName, 'users');
            res.status(500).json({
                ok: false,
                err
            });
        }
        if (! user) {
            deleteImage(fileName, 'users');
            res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró el usuario'
                }
            });
        }
        deleteImage(user.img, 'users');
        // Actualiza imagen
        user.img = fileName;
        user.save((err, user) => {
            res.json({
                ok: true,
                user,
                img: fileName
            });
        });
    });
}
function updateProductImage(id, res, fileName) {
    Product.findById(id, (err, product) => {
        if (err) {
            deleteImage(fileName, 'products')
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (! product) {
            deleteImage(fileName, 'products');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró ningún producto'
                }
            });
        }
        deleteImage(product.img, 'products');
        // Actualiza imagen 
        product.img = fileName;
        product.save((err, product) => {
             res.json({
                ok: true,
                product,
                img: fileName
            });
        });
    });
}


app.put('/upload/:category/:id', (req, res) => {
    // Maneja la carga de archivos al servidor
    if (! req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado un archivo'
            }
        });
    }
    // Valida categorías
    let category = req.params.category,
        id       = req.params.id;
    const validCategories = ['users', 'products'];
    if (validCategories.indexOf(category) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'La categoría no es válida',
                validCategories 
            }
        });
    }
    const file = req.files.file;
    let fileNameSeparated = file.name.split('.');
    let extension = fileNameSeparated[fileNameSeparated.length - 1];
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];
    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extensión no válida',
                validExtensions,
                extension
            }
        });
    }
    // Cambia el nombre archivo
    let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`;
    file.mv(`uploads/${category}/${fileName}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (category === 'users') updateUserImage(id, res, fileName);
        else updateProductImage(id, res, fileName);
    });
});


module.exports = app;