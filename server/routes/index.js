const express = require('express'),
      app     = express();

// Uso de controladores de ruta
app.use(require('./user'));
app.use(require('./login'));
app.use(require('./category'));
app.use(require('./product'));
module.exports = app;