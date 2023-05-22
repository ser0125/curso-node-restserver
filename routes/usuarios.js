const { Router } = require('express');
const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');
const { check, query } = require('express-validator');
const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole, tieneRole} = require('../middlewares');

const router = Router();

router.get('/', [
query('limit', 'El valor del limite debe ser númerico').isNumeric().optional(),
query('desde', 'El valor del desde debe ser númerico').isNumeric().optional(),
validarCampos
],
usuariosGet);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({min: 6}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    check('rol',).custom(esRolValido),
    validarCampos
], usuariosPost);

router.put('/:id', [
    check('id', "No es un id valido").isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPut);

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROL', 'VENTAS_ROL'),
    check('id', "No es un id valido").isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

router.patch('/',usuariosPatch);

module.exports = router;