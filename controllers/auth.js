const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const authLogin = async (req, res) => {

    const {correo, password} = req.body;

    try {
        //verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario) {
            return res.status(400).json({
                msg: "Usuario/Passwords no son correctos - correo"
            })
        }
        //Si el usuario esta activo
        if(!usuario.estado) {
            return res.status(400).json({
                msg: "Usuario/Passwords no son correctos - estado = false"
            })
        }
        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword) {
            return res.status(400).json({
                msg: "Usuario/Passwords no son correctos - password"
            })
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id)

        res.json({
            msg: 'Login is ok',
            usuario,
            token
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
};

module.exports = {
    authLogin
}