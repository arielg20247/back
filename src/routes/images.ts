const express = require("express");
const fs = require("fs");

let router = express.Router();

import { images } from "../db/models/images";
import { users } from "../db/models/user";
import { tags } from "../db/models/tags";
import { likes } from "../db/models/likes";
import { checktoken, getTokenData } from "../utils/checkToken";
import { comments } from "../db/models/comments";
import database from "../db/connection";
import { Transaction } from "sequelize";

//Create image

router.post("/", checktoken, async (req: any, res: any) => {
  try {
    let { image, comment, title, tagId } = req.body;

    let tokenInfo = getTokenData(req, res);

    let imageName = new Date().getTime() + ".jpg";

    let data = image.replace(/^data:image\/\w+;base64,/, "");

    let buf = Buffer.from(data, "base64");

    fs.writeFile(__dirname +
      "/../images/posts/" + imageName,
      buf,
      function (err: any, result: any) {
        if (err) {
          console.log("error", err);
        }
      }
    );
    image = imageName;
    const newImage = await images.create({
      image,
      userId: Number(tokenInfo.id),
      comment,
      tagId,
      title,
    });
    res.status(200).json({ ok: true, newImage });
  } catch (error) {
    res.status(500).json({ error: "Error subiendo imágen" });
  }
});

//Get tags

router.get("/tags", async (req: any, res: any) => {
  try {
    const resultTags = await tags.findAll();
    res.status(200).json({ resultTags });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//Get all images

router.get("/", checktoken, async (req: any, res: any) => {
  try {
    const image = await images.findAll({
      include: [
        {
          model: users,
          attributes: ["id", "name", "picture"],
        },
        {
          model: tags,
        },
      ],
    });
    if (image) {
      res.status(200).json({ ok: true, image });
    } else {
      res.status(404).json({ message: "No hay imágenes." });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//Get image

router.get("/:id", checktoken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    let canEdit = false;
    let isLiked = false;
    let tokenInfo = getTokenData(req, res);
    const image = await images.findOne({
      include: [
        {
          model: users,
          attributes: ["id", "name", "picture"],
        },
        {
          model: tags,
        },
      ],
      where: { id },
    });
    if (image) {
      if (tokenInfo.role === "ROLE_ADMIN" || tokenInfo.id == image.user.id)
        canEdit = true;
      const like = await likes.findOne({
        where: { userId: tokenInfo.id, imageId: image.id },
      });
      if (like) isLiked = true;
      res.status(200).json({ ok: true, image, canEdit, isLiked });
    } else {
      res.status(404).json({ message: "La imágen no existe." });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//Get all by User

router.get("/user/:id", checktoken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const image = await images.findAll({
      include: [
        {
          model: users,
          attributes: ["id", "name", "picture"],
        },
        {
          model: tags,
        },
      ],
      where: { userId: id },
    });
    if (image) {
      res.status(200).json({ ok: true, image });
    } else {
      res.status(404).json({ message: "No hay imágenes." });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//Edit image
router.put("/edit/:id", checktoken, async (req: any, res: any) => {
  try {
    let tokenInfo = getTokenData(req, res);
    const { id } = req.params;
    let { comment } = req.body;
    let { title } = req.body;
    let { tagId } = req.body;

    const imageData = await images.findOne({
      where: { id },
    });

    if (
      imageData &&
      (tokenInfo.role === "ROLE_ADMIN" || imageData.userId == tokenInfo.id)
    ) {
      imageData.update({
        comment,
        date: new Date(),
        tagId,
        title,
      });
      res.status(200).json({ ok: "Imagen editada" });
    } else {
      res.status(500).json({
        error: "No tienes permiso para editar los detalles o no existe",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//Delete image
router.delete("/delete/:id", checktoken, async (req: any, res: any) => {
  try {
    let tokenInfo = getTokenData(req, res);
    const { id } = req.params;

    const imageData = await images.findOne({
      where: { id },
    });

    if (!imageData) {
      res.status(500).json({ error: "No existe la imagen" });
    } else {
      if (tokenInfo.role === "ROLE_ADMIN" || imageData.userId == tokenInfo.id) {
        await database.transaction(async (t: Transaction) => {
          await comments.destroy(
            { where: { imageId: id } },
            { transaction: t }
          );
          await likes.destroy({ where: { imageId: id } }, { transaction: t });
          await imageData.destroy({ transaction: t });
        });

        res.status(200).json({ ok: "Imagen borrada" });
      } else {
        res
          .status(500)
          .json({ error: "No tienes permiso para borrar la imagen" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//Like image

router.get("/like/:id", checktoken, async (req: any, res: any) => {
  try {
    let tokenInfo = getTokenData(req, res);
    const { id } = req.params;

    await database.transaction(async (t: Transaction) => {
      await likes.create(
        {
          userId: Number(tokenInfo.id),
          imageId: Number(id),
        },
        { transaction: t }
      );

      const imageData = await images.findOne(
        {
          where: { id },
        },
        { transaction: t }
      );
      await imageData.update(
        {
          numLikes: imageData.numLikes + 1,
        },
        { transaction: t }
      );
    });
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//Unlike image

router.get("/unlike/:id", checktoken, async (req: any, res: any) => {
  try {
    let tokenInfo = getTokenData(req, res);
    const { id } = req.params;
    await database.transaction(async (t: Transaction) => {
      await likes.findOne(
        {
          userId: Number(tokenInfo.id),
          imageId: Number(id),
        },
        { transaction: t }
      );

      const imageData = await images.findOne(
        {
          where: { id },
        },
        { transaction: t }
      );
      await imageData.update(
        {
          numLikes: imageData.numLikes - 1,
        },
        { transaction: t }
      );
      await likes.destroy(
        { where: { imageId: id, userId: tokenInfo.id } },
        { transaction: t }
      );
    });
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
