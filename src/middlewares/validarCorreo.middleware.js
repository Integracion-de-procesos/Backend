const { enviarCodigoVerificacion } = require("../services/email.service");
const crypto = require("crypto");
const CodigoVerificacion = require("../models/code.model")

exports.enviarCodigo = async (req, res) => {
    try {
        const { correoElectronico } = req.body;
        if (!correoElectronico)
            return res.status(400).json({ success: false, message: "Correo requerido" });
        // Generar código aleatorio
        const codigo = crypto.randomInt(100000, 999999).toString();
        // Calcular fecha de expiración (10 minutos)
        const expira = new Date(Date.now() + 10 * 60 * 1000);
        // Eliminar códigos anteriores del mismo correo
        await CodigoVerificacion.destroy({ where: { correoElectronico } });
        // Guardar nuevo código
        await CodigoVerificacion.create({ correoElectronico, codigo, expira });
        // Enviar correo
        await enviarCodigoVerificacion(correoElectronico, codigo);
        res.json({ success: true, message: "Código enviado correctamente" });
    } catch (error) {
        // console.error("Error al enviar código:", error);
        res.status(500).json({ success: false, message: "Error interno" });
    }
};

exports.verificarCodigo = async (req, res, next) => {
    try {
        const { correoElectronico, codigo } = req.body;

        const registro = await CodigoVerificacion.findOne({ where: { correoElectronico } });
        if (!registro)
            return res.status(404).json({ success: false, message: "No se encontró código" });
        if (registro.verificado)
            return res.status(400).json({ success: false, message: "Código ya usado" });
        if (new Date() > registro.expira)
            return res.status(400).json({ success: false, message: "Código expirado" });
        if (registro.codigo !== codigo)
            return res.status(400).json({ success: false, message: "Código incorrecto" });
        registro.verificado = true;
        await registro.save();

        next()
    } catch (error) {
        // console.error("Error al verificar código:", error);
        res.status(500).json({ success: false, message: "Error interno" });
    }
};