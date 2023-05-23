const { Router } = require("express");
const { authLogin, googleLogin } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const { check } = require("express-validator");


const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], authLogin);

router.post('/google', [
    check('id_token', 'id_token es necesario').not().isEmpty(),
    validarCampos
], googleLogin);

module.exports = router;