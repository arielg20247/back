"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const CryptoJS = require("crypto-js");
let router = express.Router();
const user_1 = require("../db/models/user");
const checkToken_1 = require("../utils/checkToken");
//Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_1.users.findOne({
            where: { email, password: CryptoJS.SHA256(password).toString() },
        });
        if (user) {
            const userData = {
                id: user.id,
                nombre: req.body.nombre,
                password: req.body.password,
                role: user.role
            };
            let token = jsonwebtoken_1.default.sign(userData, checkToken_1.secretKey);
            res.status(200).json({ ok: true, token });
        }
        else {
            res.status(404).json({ message: "El usuario o la contraseña son incorrectos." });
        }
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
module.exports = router;
