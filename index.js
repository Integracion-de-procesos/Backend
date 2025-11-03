const express = require("express");
const sequelize = require("./db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

// rutas
const {
  userRoute,
  recordRoute,
  logRoute,
  videoReferenceRoute,
  youtubeRoutes,
  imageRoutes,
  googleRoute,
} = require("./src/routes/index.route");

// modelos
const {
  Usuario,
  Historial,
  VideoReferencia,
  CodigoVerificacion
} = require("./src/models/index.model");

// relaciones
const asignarRelaciones = require("./src/models/relations");

// middlewares
const app = express();
app.set("trust proxy", 1); // Confía en el primer proxy (por ejemplo Cloudflare o Nginx)
/*
    express-rate-limit usa la IP del cliente (req.ip) para contar solicitudes.
    Si la app corre detrás de un proxy o túnel, Express recibe una IP "falsa" del proxy (por ejemplo, 127.0.0.1).
    El proxy envía la IP real del cliente en el header X-Forwarded-For.
    Pero Express no confía en ese header por defecto (trust proxy = false).
    Entonces express-rate-limit detecta que hay un X-Forwarded-For, pero no puede usarlo → lanza ese error.
*/
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const { validarToken } = require("./src/middlewares/validarToken.middleware");

app.listen(3000, () => {
  console.log("escuchando en el puerto 3000");
});

// endpoints
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

app.use("/api", logRoute);
app.use("/api/usuarios", userRoute);
app.use("/api/historiales", validarToken, recordRoute);
app.use("/api/referencias", validarToken, videoReferenceRoute);
app.use("/api/youtube", validarToken, youtubeRoutes);
app.use("/api/images", validarToken, imageRoutes);
//router.post("/auth/google", googleRoute);

sequelize
  .sync({ alter: true })
  .then(async () => {
    await Usuario.sync();
    await Historial.sync();
    await VideoReferencia.sync();
    await CodigoVerificacion.sync();

    asignarRelaciones()
    console.log("base de datos sincronizada");
  })
  .catch((err) => console.error("error al sincronizar:", err));
