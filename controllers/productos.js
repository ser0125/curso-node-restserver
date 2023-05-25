const { Producto } = require("../models");

//Obtener categorias paginado - total - populate

const obtenerProductos = async (req, res, next) => {
    const { limit = 10, desde = 0 } = req.query;
    const [productos, total] = await Promise.all([
        Producto.find()
        .skip(desde)
        .limit(limit)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre'),
        Producto.countDocuments({ estado: true })
    ]
    )
    return res.status(200).json({
        msg: "Productos",
        productos,
        total
    })

};
//Obtener categoria - populate
const obtenerProducto = async (req, res, next) => {
    const { id } = req.params;

    console.log('id 2', id)

    const producto = await Producto.findById(id)
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');

    return res.status(200).json({
        msg: "Productos",
        producto
    })
};

const crearProducto = async (req, res, next) => {
    const {estado, usuario, ...body} = req.body;
    const existProducto = await Producto.findOne({ nombre: body.nombre });
    if (existProducto) {
        return res.status(400).json({
            msg: "El nombre de la categoria ya existe"
        })
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }
    const producto = new Producto(data);
    await producto.save();

    res.status(201).json(producto);
};

//Actualizar categoria
const actualizarProducto = async (req, res, next) => {
    const { id } = req.params;
    const { estado, usuario, ...body } = req.body;

    if(body.nombre) {
        body.nombre = body.nombre.toUpperCase();
    }
    body.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, body)

    return res.status(200).json({
        msg: "Producto Actualizada",
        producto
    })
};
//Borrar categoria
const borrarProducto  = async (req, res, next) => {
    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate(id, { estado: false });

    return res.status(200).json({
        msg: "Producto Actualizada",
        producto
    })
};

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}