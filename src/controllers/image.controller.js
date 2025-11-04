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

        const imagenPrev = await Imagen.findOne({ where: { idUsuario } });
        if (imagenPrev) {
            if (fs.existsSync(imagenPrev.ruta)) {
                fs.unlinkSync(imagenPrev.ruta);
            }
            await imagenPrev.destroy();
        }

        const ext = path.extname(req.file.originalname);
        const nombreArchivo = `IMG_${idUsuario}_${Date.now()}${ext}`;
        const rutaDestino = path.join(__dirname, "..", "uploads", nombreArchivo);

        fs.renameSync(req.file.path, rutaDestino);

        await Imagen.create({
            idUsuario,
            nombreArchivo,
            ruta: rutaDestino,
        });

        return res.status(201).json({
            success: true,
            message: "Imagen subida correctamente",
            data: {
                nombreArchivo: nombreArchivo
            }
        });
    } catch (error) {
        console.error("Error al subir imagen:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
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
