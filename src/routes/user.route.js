const {
    crearUsuario,
    encontrarUsuario,
    encontrarUsuarios,
    actualizarUsuario,
    eliminarUsuario,
    encontrarIdUsuario
} = require("../controllers/user.controller");
const {
    enviarCodigo,
    verificarCodigo
} = require("../middlewares/validarCorreo.middleware")
const express = require("express");

const router = express.Router();

router.post("/enviar", enviarCodigo);
router.post("/", verificarCodigo, crearUsuario);
router.get("/", encontrarUsuarios);
router.get("/id", encontrarIdUsuario);
router.get("/:id", encontrarUsuario);
router.put("/:id", actualizarUsuario);
router.delete("/:id", eliminarUsuario);

module.exports = router;
