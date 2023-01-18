"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
let router = express.Router();
const comments_1 = require("../db/models/comments");
const user_1 = require("../db/models/user");
const checkToken_1 = require("../utils/checkToken");
//Create comment
router.post("/", checkToken_1.checktoken, async (req, res) => {
    try {
        let { comment, imageId } = req.body;
        let tokenInfo = (0, checkToken_1.getTokenData)(req, res);
        if (comment.length < 8) {
            res.status(500).json({ error: 'Sube un comentario de al menos 8 caracteres' });
        }
        else {
            console.log(tokenInfo);
            const newComment = await comments_1.comments.create({
                comment,
                userId: tokenInfo.id,
                imageId,
            });
            const commentData = await comments_1.comments.findOne({
                include: [
                    {
                        model: user_1.users,
                        attributes: ["id", "name", "picture"],
                    },
                ],
                where: { imageId },
                order: [
                    ['id', 'DESC'],
                ],
            });
            res.status(200).json({ ok: true, commentData });
        }
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
//Get comments from picture
router.get("/:id", checkToken_1.checktoken, async (req, res) => {
    try {
        const { id } = req.params;
        const commentData = await comments_1.comments.findAll({
            include: [
                {
                    model: user_1.users,
                    attributes: ["id", "name", "picture"],
                },
            ],
            where: { imageId: id },
        });
        if (commentData[0]) {
            res.status(200).json({ ok: true, commentData });
        }
        else {
            res.status(200).json({ ok: true, commentData });
        }
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
//Delete comment
router.delete("/delete/:id", checkToken_1.checktoken, async (req, res) => {
    try {
        let tokenInfo = (0, checkToken_1.getTokenData)(req, res);
        const { id } = req.params;
        const commentData = await comments_1.comments.findOne({
            where: { id },
        });
        if (!commentData)
            res.status(500).json({
                error: "El comentario no existe",
            });
        else {
            if (commentData &&
                (tokenInfo.role === "ROLE_ADMIN" || commentData.userId == tokenInfo.id)) {
                commentData.destroy();
                res.status(200).json({ ok: "Comentario borrado" });
            }
            else {
                res.status(500).json({
                    error: "No tienes permiso para borrar el comentario",
                });
            }
        }
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
module.exports = router;
