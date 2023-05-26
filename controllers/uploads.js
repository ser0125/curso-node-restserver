const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");
const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const cargarArchivos = async (req, res, next) => {
    try {
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({ nombre })
    } catch (err) {
        res.status(400).json({
            err
        })
    }
}

const actualizarImagen = async (req, res) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: 'No existe un usuario con ese id'
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: 'No existe un producto con ese id'
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Falta validacion' })
    }

    try {
        //limpiar imagenes previas
        if (modelo.img) {
            const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if (fs.existsSync(pathImg)) {
                fs.unlinkSync(pathImg);
            }
        }
        const nombre = await subirArchivo(req.files, undefined, coleccion);
        modelo.img = nombre;
        modelo.save();
        res.json({
            modelo
        })
    } catch (err) {
        res.status(400).json({
            err
        })
    }
}

const mostrarImagen = async (req, res) => {
    const { id, coleccion } = req.params

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: 'No existe un usuario con ese id'
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: 'No existe un producto con ese id'
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Falta validacion' })
    }

    try {
        //limpiar imagenes previas
        if (modelo.img) {
            const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if (fs.existsSync(pathImg)) {
                return res.sendFile(pathImg);
            }
        }
        const pathImg = path.join(__dirname, '../assets/no-image.jpg');
        return res.sendFile(pathImg)
    } catch (err) {
        res.status(400).json({
            err
        })
    }
}

const actualizarImagenCloudinary = async (req, res) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: 'No existe un usuario con ese id'
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: 'No existe un producto con ese id'
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Falta validacion' })
    }

    try {
        //limpiar imagenes previas
        if (modelo.img) {
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[nombreArr.length - 1];
            const [public_id] = nombre.split('.');
            cloudinary.uploader.destroy(public_id);
        }
        console.log(req.files.archivo)
        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath)

        modelo.img = secure_url;
        modelo.save();
        /*         const nombre = await subirArchivo(req.files, undefined, coleccion);*/
        res.json({
            secure_url
        })
    } catch (err) {
        console.error(`Error: ${err}`);
        res.status(400).json({
            err
        })
    }
}

module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}