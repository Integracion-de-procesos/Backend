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

app.set("trust proxy", 1); // Confía en el primer proxy (por ejemplo Cloudflare o Nginx)
/*
    express-rate-limit usa la IP del cliente (req.ip) para contar solicitudes.
    Si la app corre detrás de un proxy o túnel, Express recibe una IP "falsa" del proxy (por ejemplo, 127.0.0.1).
    El proxy envía la IP real del cliente en el header X-Forwarded-For.
    Pero Express no confía en ese header por defecto (trust proxy = false).
    Entonces express-rate-limit detecta que hay un X-Forwarded-For, pero no puede usarlo → lanza ese error.
*/
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