const { Router } = require("express");;
const { validarCampos } = require("../middlewares/validar-campos");
const { check, body } = require("express-validator");
const { existeCategoriaPorId, esRolValido, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarJWT, tieneRole } = require("../middlewares");
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require("../controllers/categorias");


const router = Router();

//Obtener todas las categorias
 router.get('/', [
    validarCampos
], obtenerCategorias);

//Obtener 1 categoria
router.get('/:id', [
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria);

//Crear 1 categoria
router.post('/', [
    validarJWT,
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//Actualizar 1 registro
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    check('nombre').not().isEmpty(),
    validarCampos
], actualizarCategoria);

//Borrar 1 categoria
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROL', 'VENTAS_ROL'),
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);
 
module.exports = router;