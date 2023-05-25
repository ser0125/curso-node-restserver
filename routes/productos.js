const { Router } = require("express");;
const { validarCampos } = require("../middlewares/validar-campos");
const { check, body } = require("express-validator");
const { existeCategoriaPorId, esRolValido, existeUsuarioPorId, existeProductoPorId } = require('../helpers/db-validators');
const { validarJWT, tieneRole, esAdminRole } = require("../middlewares");
const { obtenerProductos, crearProducto, obtenerProducto, actualizarProducto, borrarProducto } = require("../controllers/productos");


const router = Router();

//Obtener todos los productos
router.get('/', [
    validarCampos
], obtenerProductos);

//Obtener 1 categoria
router.get('/:id', [
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

//Crear 1 categoria
router.post('/', [
    validarJWT,
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    body('categoria', 'La categoria id no es valida').isMongoId(),
    body('categoria',).custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

//Actualizar 1 registro
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

//Borrar 1 categoria
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);
 
module.exports = router;