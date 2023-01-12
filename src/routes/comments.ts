const express = require("express");

let router = express.Router();

import { comments } from "../db/models/comments";
import { users } from "../db/models/user";

import { checktoken, getTokenData } from "../utils/checkToken";

//Create comment

router.post("/", checktoken, async (req: any, res: any) => {
  try {
    let { comment, imageId } = req.body;

    let tokenInfo = getTokenData(req, res);

    console.log(tokenInfo);
    const newComment = await comments.create({
      comment,
      userId: tokenInfo.id,
      imageId,
    });
    res.status(200).json({ ok: true, newComment });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//Get comments from picture

router.get("/:id", checktoken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const commentData = await comments.findAll({
      include: [
        {
          model: users,
          attributes: ["id", "name", "picture"],
        },
      ],
      where: { imageId: id },
    });
    if (commentData[0]) {
      res.status(200).json({ ok: true, commentData });
    } else {
      res.status(404).json({ message: "No hay comentarios." });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//Delete comment
router.delete("/delete/:id", checktoken, async (req: any, res: any) => {
  try {
    let tokenInfo = getTokenData(req, res);
    const { id } = req.params;

    const commentData = await comments.findOne({
      where: { id },
    });

    if (!commentData)
      res.status(500).json({
        error: "El comentario no existe",
      });
    else {
      if (
        commentData &&
        (tokenInfo.role === "ROLE_ADMIN" || commentData.userId == tokenInfo.id)
      ) {
        commentData.destroy();
        res.status(200).json({ ok: "Comentario borrado" });
      } else {
        res.status(500).json({
          error: "No tienes permiso para borrar el comentario",
        });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
