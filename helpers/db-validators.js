const Rol = require('../models/rol');
const User = require('../models/usuario');

const esRolValido = async(rol='') => {
    const existeRol = await Rol.findOne({ rol });
    if(!existeRol){
        throw new Error(`El rol ${rol} no se encuentra en la DB`)
    }
};

const emailExiste = async(correo='') => {
    const emailDb = await User.findOne({ correo });
    if(emailDb) {
        throw new Error(`El email ${correo} ya se encuentra en la DB`)
    }
};

const existeUsuarioPorId = async(id) => {
    const existeUsuario = await User.findById( id );
    if(!existeUsuario) {
        throw new Error(`El usuario ${id} no se encuentra en la DB`)
    }
};

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId
}