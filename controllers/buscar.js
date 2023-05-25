const { Usuario, Categoria, Producto } = require('../models');

const { ObjectId } = require('mongoose').Types;


const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async(termino='', res) => {
    const isMongoId = ObjectId.isValid(termino);
    if(isMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: usuario ? [ usuario ] : []
        })
    }
    const regex = new RegExp(termino, 'i')
    const usuario = await Usuario.find({ 
        $or: [ {nombre: regex }, {correo: regex}],
        $and: [{estado: true}]
    });
    return res.json({
        results: usuario
    })
}


const buscarCategoria = async(termino='', res) => {
    const isMongoId = ObjectId.isValid(termino);
    if(isMongoId) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: categoria ? [ categoria ] : []
        })
    }
    const regex = new RegExp(termino, 'i');
    const categoria = await Categoria.find({nombre: regex, estado: true });
    return res.json({
        results: categoria
    })
}

const buscarProducto = async(termino='', res) => {
    const isMongoId = ObjectId.isValid(termino);
    if(isMongoId) {
        const producto = await Producto.findById(termino);
        return res.json({
            results: producto ? [ producto ] : []
        })
    }
    const regex = new RegExp(termino, 'i');
    const producto = await Producto.find({nombre: regex, estado: true }).populate('categoria', 'nombre');
    return res.json({
        results: producto
    })
}

const buscar = async(req, res, next) => {
    const { coleccion, termino } = req.params;
    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            await buscarUsuarios(termino, res)
            break;
        case 'categorias':
            await buscarCategoria(termino, res)
            break;
        case 'productos':
            await buscarProducto(termino, res)
            return;
        case 'roles':
            break;
        default:
            res.status(500).json({
                msg: 'Falta una busqueda'
            })
            break;
    }
};

module.exports = {
    buscar
}