const cargarArchivos = (req, res, next) => {
    res.json({
        msg: 'Carga de archivos'
    })
}

module.exports = {
    cargarArchivos
}