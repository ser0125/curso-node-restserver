const {response} = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const usuariosGet = async(req, res=response) => {

   const {limit = 10, desde = 0} = req.query;

/*    const usuarios = await Usuario.find({ estado: true }).skip(desde).limit(limit)
   const total = await Usuario.countDocuments({ estado: true }) */
   const [usuarios, total] = await Promise.all(
    [
        Usuario.find({ estado: true }).skip(desde).limit(limit),
        Usuario.countDocuments({ estado: true })
    ]
   )

    res.json({
        total,
        msg: 'get api Controllador',
        usuarios
    })
};

const usuariosPost= async (req, res=response) => {

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol} );

    //Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(
        password,
        salt
    )

    //Guardar en base de datos
    await usuario.save();
    res.json({
        msg: 'post api Controllador',
        usuario
    })
};

const usuariosPut = async (req, res=response) => {

    const {id} = req.params;
    const {password, _id, google, correo, ...user} = req.body;

    if(password) {
        //Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(
        password,
        salt
        )
    }

    const usuario = await Usuario.findByIdAndUpdate(id, user);

    res.json({
        msg: 'put api Controllador',
        usuario
    })
};

const usuariosPatch = (req, res=response) => {
    res.json({
        msg: 'patch api Controllador'
    })
};

const usuariosDelete = async (req, res=response) => {
    const { id } = req.params;

    console.log(id);
    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json(usuario)
};
module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}