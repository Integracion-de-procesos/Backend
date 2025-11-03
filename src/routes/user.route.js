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
const rateLimit = require("express-rate-limit");

const codeLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // Cada 10 min
    max: 3, // 3 intentos por IP
    message: {
        success: false,
        message: "Demasiadas solicitudes de verificación, intenta más tarde",
    },
});

const express = require("express");
const router = express.Router();

router.post("/enviar", codeLimiter, enviarCodigo);
router.post("/", verificarCodigo, crearUsuario);
router.get("/", encontrarUsuarios);
router.get("/id", encontrarIdUsuario);
router.get("/:id", encontrarUsuario);
router.put("/:id", actualizarUsuario);
router.delete("/:id", eliminarUsuario);

module.exports = router;