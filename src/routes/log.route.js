const { generar, remover } = require("../controllers/autenticate.controller");
const { loginGoogle } = require("../controllers/googleAuth.controller");

const express = require("express");

const router = express.Router();

router.post("/auth/google", loginGoogle);
router.post("/login", generar);
router.post("/logout", remover);

module.exports = router;