const {response} = require('express');

const usuariosGet = (req, res=response) => {

    const {q, nombre='No name'} = req.query;

    res.json({
        msg: 'get api Controllador',
        q,
        nombre
    })
};

const usuariosPost= (req, res=response) => {
    const {nombre, edad} = req.body;
    res.json({
        msg: 'post api Controllador',
        nombre,
        edad
    })
};

const usuariosPut = (req, res=response) => {

    const id = req.id;

    res.json({
        msg: 'put api Controllador',
        id
    })
};

const usuariosPatch = (req, res=response) => {
    res.json({
        msg: 'patch api Controllador'
    })
};

const usuariosDelete = (req, res=response) => {
    res.json({
        msg: 'delete api Controllador'
    })
};
module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}