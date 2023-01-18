"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const fs = require("fs");
let router = express.Router();
const images_1 = require("../db/models/images");
const user_1 = require("../db/models/user");
const tags_1 = require("../db/models/tags");
const likes_1 = require("../db/models/likes");
const checkToken_1 = require("../utils/checkToken");
const comments_1 = require("../db/models/comments");
const connection_1 = __importDefault(require("../db/connection"));
//Create image
router.post("/", checkToken_1.checktoken, async (req, res) => {
    try {
        let { image, comment, title, tagId } = req.body;
        let tokenInfo = (0, checkToken_1.getTokenData)(req, res);
        let imageName = new Date().getTime() + ".jpg";
        let data = image.replace(/^data:image\/\w+;base64,/, "");
        let buf = Buffer.from(data, "base64");
        fs.writeFile(__dirname +
            "/../images/posts/" + imageName, buf, function (err, result) {
            if (err) {
                console.log("error", err);
            }
        });
        image = imageName;
        const newImage = await images_1.images.create({
            image,
            userId: Number(tokenInfo.id),
            comment,
            tagId,
            title,
        });
        res.status(200).json({ ok: true, newImage });
    }
    catch (error) {
        res.status(500).json({ error: "Error subiendo imágen" });
    }
});
//Get tags
router.get("/tags", async (req, res) => {
    try {
        const resultTags = await tags_1.tags.findAll();
        res.status(200).json({ resultTags });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
//Get all images
router.get("/", checkToken_1.checktoken, async (req, res) => {
    try {
        const image = await images_1.images.findAll({
            include: [
                {
                    model: user_1.users,
                    attributes: ["id", "name", "picture"],
                },
                {
                    model: tags_1.tags,
                },
            ],
        });
        if (image) {
            res.status(200).json({ ok: true, image });
        }
        else {
            res.status(404).json({ message: "No hay imágenes." });
        }
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
//Get image
router.get("/:id", checkToken_1.checktoken, async (req, res) => {
    try {
        const { id } = req.params;
        let canEdit = false;
        let isLiked = false;
        let tokenInfo = (0, checkToken_1.getTokenData)(req, res);
        const image = await images_1.images.findOne({
            include: [
                {
                    model: user_1.users,
                    attributes: ["id", "name", "picture"],
                },
                {
                    model: tags_1.tags,
                },
            ],
            where: { id },
        });
        if (image) {
            if (tokenInfo.role === "ROLE_ADMIN" || tokenInfo.id == image.user.id)
                canEdit = true;
            const like = await likes_1.likes.findOne({
                where: { userId: tokenInfo.id, imageId: image.id },
            });
            if (like)
                isLiked = true;
            res.status(200).json({ ok: true, image, canEdit, isLiked });
        }
        else {
            res.status(404).json({ message: "La imágen no existe." });
        }
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
//Get all by User
router.get("/user/:id", checkToken_1.checktoken, async (req, res) => {
    try {
        const { id } = req.params;
        const image = await images_1.images.findAll({
            include: [
                {
                    model: user_1.users,
                    attributes: ["id", "name", "picture"],
                },
                {
                    model: tags_1.tags,
                },
            ],
            where: { userId: id },
        });
        if (image) {
            res.status(200).json({ ok: true, image });
        }
        else {
            res.status(404).json({ message: "No hay imágenes." });
        }
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
//Edit image
router.put("/edit/:id", checkToken_1.checktoken, async (req, res) => {
    try {
        let tokenInfo = (0, checkToken_1.getTokenData)(req, res);
        const { id } = req.params;
        let { comment } = req.body;
        let { title } = req.body;
        let { tagId } = req.body;
        const imageData = await images_1.images.findOne({
            where: { id },
        });
        if (imageData &&
            (tokenInfo.role === "ROLE_ADMIN" || imageData.userId == tokenInfo.id)) {
            imageData.update({
                comment,
                date: new Date(),
                tagId,
                title,
            });
            res.status(200).json({ ok: "Imagen editada" });
        }
        else {
            res.status(500).json({
                error: "No tienes permiso para editar los detalles o no existe",
            });
        }
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
//Delete image
router.delete("/delete/:id", checkToken_1.checktoken, async (req, res) => {
    try {
        let tokenInfo = (0, checkToken_1.getTokenData)(req, res);
        const { id } = req.params;
        const imageData = await images_1.images.findOne({
            where: { id },
        });
        if (!imageData) {
            res.status(500).json({ error: "No existe la imagen" });
        }
        else {
            if (tokenInfo.role === "ROLE_ADMIN" || imageData.userId == tokenInfo.id) {
                await connection_1.default.transaction(async (t) => {
                    await comments_1.comments.destroy({ where: { imageId: id } }, { transaction: t });
                    await likes_1.likes.destroy({ where: { imageId: id } }, { transaction: t });
                    await imageData.destroy({ transaction: t });
                });
                res.status(200).json({ ok: "Imagen borrada" });
            }
            else {
                res
                    .status(500)
                    .json({ error: "No tienes permiso para borrar la imagen" });
            }
        }
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
//Like image
router.get("/like/:id", checkToken_1.checktoken, async (req, res) => {
    try {
        let tokenInfo = (0, checkToken_1.getTokenData)(req, res);
        const { id } = req.params;
        await connection_1.default.transaction(async (t) => {
            await likes_1.likes.create({
                userId: Number(tokenInfo.id),
                imageId: Number(id),
            }, { transaction: t });
            const imageData = await images_1.images.findOne({
                where: { id },
            }, { transaction: t });
            await imageData.update({
                numLikes: imageData.numLikes + 1,
            }, { transaction: t });
        });
        res.status(200).json({ ok: true });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
//Unlike image
router.get("/unlike/:id", checkToken_1.checktoken, async (req, res) => {
    try {
        let tokenInfo = (0, checkToken_1.getTokenData)(req, res);
        const { id } = req.params;
        await connection_1.default.transaction(async (t) => {
            await likes_1.likes.findOne({
                userId: Number(tokenInfo.id),
                imageId: Number(id),
            }, { transaction: t });
            const imageData = await images_1.images.findOne({
                where: { id },
            }, { transaction: t });
            await imageData.update({
                numLikes: imageData.numLikes - 1,
            }, { transaction: t });
            await likes_1.likes.destroy({ where: { imageId: id, userId: tokenInfo.id } }, { transaction: t });
        });
        res.status(200).json({ ok: true });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
module.exports = router;
