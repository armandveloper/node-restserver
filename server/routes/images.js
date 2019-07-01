const express = require('express'),
      fs      = require('fs'),
      path    = require('path');
const {checkTokenImg} = require('../middlewares/authentication');
const app = express();

app.get('/imagen/:category/:img', checkTokenImg, (req, res) => {
    let pathImg = path.resolve(__dirname, `../../uploads/${req.params.category}/${req.params.img}`);
    let pathNoImage = path.resolve(__dirname, '../assets/no-image.jpg');
    if (fs.existsSync(pathImg)) res.sendFile(pathImg);
    else res.sendFile(pathNoImage);
});


module.exports = app;