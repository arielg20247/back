"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
let validator = require("email-validator");
const CryptoJS = require("crypto-js");
const fs = require("fs");
let router = express.Router();
const user_1 = require("../db/models/user");
const checkToken_1 = require("../utils/checkToken");
//Create user
router.post("/", async (req, res) => {
    try {
        let { name, password, email, picture } = req.body;
        console.log(email);
        console.log(name);
        console.log(name.lenght < 8);
        if (!validator.validate(email)) {
            res.status(500).json({ error: "Introduce un correo electrónico válido" });
        }
        else if (name.length < 8) {
            res.status(500).json({ error: "Introduce nombre de más de 8 caracteres" });
        }
        else if (password.length < 8) {
            res.status(500).json({ error: "Introduce una contraseña de más de 8 caracteres" });
        }
        else {
            if (picture) {
                let imageName = new Date().getTime() + ".jpg";
                let data = picture.replace(/^data:image\/\w+;base64,/, "");
                let buf = Buffer.from(data, "base64");
                fs.writeFile(__dirname +
                    "/../images/profile/" + imageName, buf, function (err, result) {
                    if (err) {
                        console.log("error", err);
                    }
                });
                picture = imageName;
            }
            await user_1.users.create({
                name,
                password: CryptoJS.SHA256(password).toString(),
                email,
                picture
            });
            res.status(200).json({ ok: true });
        }
    }
    catch (error) {
        if (error.errors[0].message == "email must be unique") {
            res.status(500).json({ error: "Este correo ya está registrado" });
        }
        else {
            res.status(500).json({ error: error.errors[0].message });
        }
    }
});
//Get my user
router.get("/me", checkToken_1.checktoken, async (req, res) => {
    try {
        let tokenInfo = (0, checkToken_1.getTokenData)(req, res);
        const user = await user_1.users.findOne({
            where: { id: tokenInfo.id },
        });
        if (user) {
            const userData = {
                name: user.name,
                picture: user.picture,
                id: user.id,
                email: user.email
            };
            res.status(200).json({ ok: true, userData });
        }
        else {
            res.status(404).json({ message: "El usuario no existe." });
        }
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
//Get user
router.get("/:id", checkToken_1.checktoken, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await user_1.users.findOne({
            where: { id },
        });
        let tokenInfo = (0, checkToken_1.getTokenData)(req, res);
        if (user) {
            if (tokenInfo.role === "ROLE_ADMIN" || tokenInfo.id == id) {
                const userData = {
                    name: user.name,
                    picture: user.picture,
                    id: user.id,
                    email: user.email,
                    role: user.role
                };
                res.status(200).json({ ok: true, userData });
            }
            else {
                const userData = {
                    name: user.name,
                    picture: user.picture,
                    id: user.id
                };
                res.status(200).json({ ok: true, userData });
            }
        }
        else {
            res.status(404).json({ message: "El usuario no existe." });
        }
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
//Edit user
router.put("/edit/:id", checkToken_1.checktoken, async (req, res) => {
    try {
        let tokenInfo = (0, checkToken_1.getTokenData)(req, res);
        const { id } = req.params;
        let { name, email, role, picture } = req.body;
        if (tokenInfo.role === "ROLE_ADMIN" || tokenInfo.id == id) {
            const user = await user_1.users.findOne({
                where: { id },
            });
            user.update({
                name,
                email,
                role,
                picture,
            });
            res.status(200).json({ ok: "Usuario editado correctamente" });
        }
        else {
            res.status(500).json({ error: "No tienes permiso para editar los detalles" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
module.exports = router;
