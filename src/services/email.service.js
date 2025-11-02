const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function enviarCodigoVerificacion(correo, codigo) {
    const mailOptions = {
        from: `"GeoYuTub" <${process.env.EMAIL_USER}>`,
        to: correo,
        subject: "Código de verificación",
        html: `
      <div style="font-family:sans-serif">
        <h2>Verifica tu cuenta</h2>
        <p>Tu código de verificación es:</p>
        <h1 style="color:#007bff">${codigo}</h1>
        <p>Este código expira en 10 minutos.</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { enviarCodigoVerificacion };
