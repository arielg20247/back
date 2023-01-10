const express = require("express");
let validator = require("email-validator");

let router = express.Router();

import { users } from "../db/models/user";

import { checktoken, checkAdmin, getTokenData } from "../utils/checkToken";

//Create user

router.post("/", async (req: any, res: any) => {
  try {
    let { name, password, email } = req.body;

    if (!validator.validate(email)) {
      res.status(500).json({ error: "Introduce un correo electrónico válido" });
    } else {
      const newUser = await users.create({
        name,
        password,
        email,
      });
      res.status(200).json({ ok: true, newUser });
    }
  } catch (error) {
    res.status(500).json({ error: error });
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

    console.log(tokenInfo.role);
    console.log(id);
    console.log(tokenInfo.id);
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
