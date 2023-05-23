const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleLogin = async (req, res, next) => {
    const {id_token} = req.body;
    console.log(id_token)

    try {
        const { nombre, picture, correo } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });
        if(!usuario) {
            const data = {
                nombre,
                correo,
                password: ':P',
                picture,
                google: true,
                rol: "USER_ROL"
            }

            usuario = new Usuario(data);
            usuario.save();
        }

        if(!usuario.estado) {
            res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        const token = generarJWT(usuario.id);

        res.json({
            msg: 'Todo funciona correctamente',
            usuario,
            token
        })

    } catch(e) {
        console.log(e)

        res.status(400).json({
            msg: 'El token no se pudo verificar'
        })
    }


}

module.exports = {
    authLogin,
    googleLogin
}