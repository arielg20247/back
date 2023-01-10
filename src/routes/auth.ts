const express = require("express");
import jwt from "jsonwebtoken";
const CryptoJS = require("crypto-js");

let router = express.Router();

import { users } from "../db/models/user";
import { secretKey } from "../utils/checkToken";
//Login

router.post("/login", async (req: any, res: any) => {
    try {
      const { email, password } = req.body;
      const user = await users.findOne({
        where: { email, password:CryptoJS.SHA256(password).toString() },
      });
      if (user) {
          const userData = {
            id:user.id,
            nombre: req.body.nombre,
            password: req.body.password,
            role: user.role
          };
          let token = jwt.sign(userData, "thiIsMyPassword");
          res.status(200).json({ ok: true, token });
      } else {
        res.status(404).json({ message: "El usuario o la contraseña son incorrectos."});
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });

module.exports = router;