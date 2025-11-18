const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/user.model");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const TOKEN_SECRET = process.env.TOKEN_SECRET;

exports.loginGoogle = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({
                success: false,
                message: "idToken requerido",
            });
        }

        // Validar el token con Google
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        // Datos del usuario proporcionados por Google
        const { email, name } = payload;

        // Buscar usuario por correo
        let usuario = await Usuario.findOne({
            where: { correoElectronico: email },
        });

        // Si no existe, crearlo
        if (!usuario) {
            usuario = await Usuario.create({
                correoElectronico: email,
                nombres: name,
                contraseña: null,
            });
        }

        // Generar JWT propio
        const token = jwt.sign(
            {
                idUsuario: usuario.idUsuario,
                correoElectronico: usuario.correoElectronico,
            },
            TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        // Guardar token en cookie segura
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 día
        });

        // Respuesta al cliente
        return res.status(200).json({
            success: true,
            mensaje: "Autenticado correctamente",
            token,
            usuario: {
                idUsuario: usuario.idUsuario,
                nombres: usuario.nombres,
                correoElectronico: usuario.correoElectronico,
            },
        });

    } catch (error) {
        console.log("Error Google Login:", error);
        return res.status(500).json({
            success: false,
            message: "Error verificando token de Google",
        });
    }
};
