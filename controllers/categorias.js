const { esRolValido } = require("../helpers/db-validators");
const { Categoria } = require("../models");

//Obtener categorias paginado - total - populate

const obtenerCategorias = async (req, res, next) => {
    const { limit = 10, desde = 0 } = req.query;
    const [categorias, total] = await Promise.all([
        Categoria.find().skip(desde).limit(limit).populate('usuario'),
        Categoria.countDocuments({ estado: true })
    ]
    )
    return res.status(200).json({
        msg: "Categorias",
        categorias,
        total
    })

};
//Obtener categoria - populate
const obtenerCategoria = async (req, res, next) => {
    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario');

    return res.status(200).json({
        msg: "Categorias",
        categoria
    })
};

const crearCategoria = async (req, res, next) => {
    const nombre = req.body.nombre.toUpperCase();
    const existCategoria = await Categoria.findOne({ nombre });
    if (existCategoria) {
        return res.status(400).json({
            msg: "El nombre de la categoria ya existe"
        })
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }
    const categoria = new Categoria(data);
    await categoria.save();

    res.status(201).json(categoria);
};

//Actualizar categoria
const actualizarCategoria = async (req, res, next) => {
    const { id } = req.params;
    const { nombre } = req.body;

    const categoria = await Categoria.findByIdAndUpdate(id, { nombre: nombre.toUpperCase() })

    return res.status(200).json({
        msg: "Categoria Actualizada",
        categoria
    })
};
//Borrar categoria
const borrarCategoria = async (req, res, next) => {
    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false });

    return res.status(200).json({
        msg: "Categoria Actualizada",
        categoria
    })
};

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}