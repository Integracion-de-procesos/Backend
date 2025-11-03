const express = require("express");
const multer = require("multer");
const path = require("path");
const {
    subirImagen,
    encontrarImagen,
    eliminarImagen,
    actualizarImagen
} = require("../controllers/image.controller");

const upload = multer({ dest: path.join(__dirname, "..", "uploads_temp") });
const router = express.Router();

router.put("/", upload.single("image"), actualizarImagen);
router.get("/:idUsuario", encontrarImagen);
router.delete("/:idUsuario", eliminarImagen);

module.exports = router;
