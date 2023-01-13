const express = require("express");
let validator = require("email-validator");
const CryptoJS = require("crypto-js");
const fs = require("fs");

let router = express.Router();

import { users } from "../db/models/user";

import { checktoken, getTokenData } from "../utils/checkToken";

//Create user

router.post("/", async (req: any, res: any) => {
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
    }  else {

      if (picture)
      {
        let imageName = new Date().getTime() + ".jpg";

        let data = picture.replace(/^data:image\/\w+;base64,/, "");
    
        let buf = Buffer.from(data, "base64");
    
        fs.writeFile(
          "./src/images/profile/" + imageName,
          buf,
          function (err: any, result: any) {
            if (err) {
              console.log("error", err);
            }
          }
        );
        picture = imageName;
      }

      await users.create({
        name,
        password:CryptoJS.SHA256(password).toString(),
        email,
        picture
      });
      res.status(200).json({ ok: true });
    }
  } catch (error:any) {
    if (error.errors[0].message == "email must be unique")
    {
      res.status(500).json({ error: "Este correo ya está registrado" });
    }
    else{
      res.status(500).json({ error: error.errors[0].message });
    }
  }
});

//Get user

router.get("/:id", checktoken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const user = await users.findOne({
      where: { id },
    });
    if (user) {
      const userData = {
        name: user.name,
        picture: user.picture,
      };
      res.status(200).json({ ok: true, userData });
    } else {
      res.status(404).json({ message: "El usuario no existe." });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//Edit user
router.put("/edit/:id", checktoken, async (req: any, res: any) => {
  try {
    let tokenInfo = getTokenData(req, res);
    const { id } = req.params;
    let { name, email, role, picture } = req.body;

    if (tokenInfo.role === "ROLE_ADMIN" || tokenInfo.id == id) {
      const user = await users.findOne({
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
    else{
        res.status(500).json({ error: "No tienes permiso para editar los detalles" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
module.exports = router;
