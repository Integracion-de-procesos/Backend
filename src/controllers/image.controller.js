const fs = require("fs");
const path = require("path");
const Usuario = require("../models/user.model");
const Imagen = require("../models/image.model");

const subirImagen = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No se subió ninguna imagen",
            });
        }

        const { idUsuario } = req.body;

        const usuario = await Usuario.findByPk(idUsuario);
        if (!usuario) {
            fs.unlinkSync(req.file.path);
            return res.status(404).json({
                success: false,
                message: "No se encontró el usuario",
            });
        }
        const imagenExistente = await Imagen.findOne({ where: { idUsuario } });
        if (imagenExistente) {
            if (fs.existsSync(imagenExistente.ruta)) {
                fs.unlinkSync(imagenExistente.ruta);
            }
            // Eliminar registro en la base de datos
            await Imagen.destroy({ where: { idUsuario } });
        }
        const nombreArchivo = `IMG_${idUsuario}${path.extname(req.file.originalname)}`;
        const rutaDestino = path.join(__dirname, "..", "uploads", nombreArchivo);
        if (!fs.existsSync(path.join(__dirname, "..", "uploads"))) {
            fs.mkdirSync(path.join(__dirname, "..", "uploads"));
        }
        fs.renameSync(req.file.path, rutaDestino);
        await Imagen.create({
            idUsuario,
            nombreArchivo,
            ruta: rutaDestino,
        });

        res.status(201).json({
            success: true,
            message: imagenExistente
                ? "Imagen actualizada correctamente"
                : "Imagen subida correctamente",
            nombreArchivo,
        });
    } catch (error) {
        console.error("Error en subirImagen:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error al subir la imagen",
        });
    }
};

const encontrarImagen = async (req, res) => {
    try {
        const { idUsuario } = req.params;
        const imagen = await Imagen.findOne({ where: { idUsuario } });
        if (!imagen) {
            return res.status(404).json({
                success: false,
                message: "No se encontró ninguna imagen para este usuario",
            });
        }
        // Se envia el archivo directamente
        const filePath = path.resolve(imagen.ruta);
        if (fs.existsSync(filePath)) {
            return res.sendFile(filePath);
        } else {
            return res.status(404).json({
                success: false,
                message: "El archivo físico no existe",
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const eliminarImagen = async (req, res) => {
    try {
        const { idUsuario } = req.params;
        const imagen = await Imagen.findOne({ where: { idUsuario } });
        if (!imagen) {
            return res
                .status(404)
                .json({ success: false, message: "No se encontró la imagen" });
        }
        // Eliminar archivo físico
        if (fs.existsSync(imagen.ruta)) {
            fs.unlinkSync(imagen.ruta);
        }
        // Eliminar registro en BD
        await Imagen.destroy({ where: { idUsuario } });
        res.status(200).json({
            success: true,
            message: "Imagen eliminada correctamente",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    subirImagen,
    encontrarImagen,
    eliminarImagen,
};
