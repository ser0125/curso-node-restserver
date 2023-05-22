const esAdminRole = (req, res, next) => {
    if( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quire verificar el role sin verificar el token primero'
        })
    }
    const {rol, nombre} = req.usuario;
    if(rol !== 'ADMIN_ROL') {
        return res.status(401).json({
            msg: `${nombre} no es administrador`
        })
    }
    next();
};

const tieneRole = (...roles) => {
    
    return (req, res, next) => {
        if( !req.usuario ) {
            return res.status(500).json({
                msg: 'Se quire verificar el role sin verificar el token primero'
            })
        }
    
        if(!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            })
        }
        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}