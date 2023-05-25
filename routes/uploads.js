const { Router } = require("express");
const { authLogin, googleLogin } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const { check } = require("express-validator");
const { cargarArchivos } = require("../controllers/uploads");


const router = Router();

router.post('/', cargarArchivos);

module.exports = router;