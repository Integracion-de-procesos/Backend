const {
    enviarCodigo,
    verificarCodigo
} = require("../middlewares/validarCorreo.middleware");
const express = require("express");

const router = express.Router();

router.post("/enviar", enviarCodigo);
router.post("/verificar", verificarCodigo);

module.exports = router;