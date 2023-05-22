const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req, res, next) => {
    const token = req.header('x-token');
    if(!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }
    try {
        const {uuid} = jwt.verify(token, process.env.SECRET_KEY);
        //Leer usuario que corresponde a ese uuid
        req.usuario = await Usuario.findById(uuid);
        if(!req.usuario) {
            return res.status(400).json({
                msg: 'El usuario no se encuentra en la DB'
            })
        }
        if(!req.usuario.estado) {
            return res.status(400).json({
                msg: 'El usuario estado es false'
            })
        }
        req.uuid = uuid;
        next();
    } catch(e) {
        console.log(e);
        res.status(401).json({
            msg: 'El token no es valido'
        })
    }  
}

module.exports = {
    validarJWT
}