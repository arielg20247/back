const express = require("express");
const fs = require("fs");

let router = express.Router();

import { images } from "../db/models/images";

import { checktoken,getTokenData } from "../utils/checkToken";

//Create image

router.post("/", checktoken, async (req: any, res: any) => {
  try {
    let { image, comment } = req.body;

    let tokenInfo = getTokenData(req, res);

    let imageName = new Date().getTime() + ".jpg";

    let data = image.replace(/^data:image\/\w+;base64,/, "");

    let buf = Buffer.from(data, 'base64');
    

    fs.writeFile(
        "./src/images/posts/" + imageName,
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
      comment
    });
    res.status(200).json({ ok: true, newImage, pepe:tokenInfo.id });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//Get image

router.get("/:id", checktoken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const image = await images.findOne({
      where: { id },
    });
    if (image) {
      res.status(200).json({ ok: true, image });
    } else {
      res.status(404).json({ message: "La imágen no existe." });
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

    const imageData = await images.findOne({
      where: { id },
    });

    if (
      imageData &&
      (tokenInfo.role === "ROLE_ADMIN" || imageData.userId == tokenInfo.id)
    ) {
      imageData.update({
        comment,
        date: new Date()
      });
      res.status(200).json({ ok: "Imagen editada" });
    } else {
      res
        .status(500)
        .json({ error: "No tienes permiso para editar los detalles o no existe" });
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
  
      if (
        imageData &&
        (tokenInfo.role === "ROLE_ADMIN" || imageData.userId == tokenInfo.id)
      ) {
        imageData.destroy();
        res.status(200).json({ ok: "Imagen borrada" });
      } else {
        res
          .status(500)
          .json({ error: "No tienes permiso para borrar la imagen o no existe" });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });

module.exports = router;
