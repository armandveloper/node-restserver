const jwt = require('jsonwebtoken');
const checkToken = (req, res, next) => {
    // Verifica que se envíe un token válido
    // Accede al valor del encabezado token
    const token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.user = decoded.user;
        next();
    });
    
};
const checkRole = (req, res, next) => {
    // Comprueba que el usuario se admin para poder realizar acciones
    if (! (req.user.role === 'ADMIN_ROLE')) {
        return res.json({
            ok: false,
            err: {
                message: 'No es un administrador'
            }
        });
    }
    next();
};
module.exports = {
    checkToken,
    checkRole
};