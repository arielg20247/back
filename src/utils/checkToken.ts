const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
import { users } from "../db/models/user";

export const secretKey = "thiIsMyPassword";

export function checktoken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  try {
    
    jwt.verify(token, secretKey, function (err: any, decoded: any) {
        res = {
          id: decoded.id,
          role: decoded.role
        };
      });
    
    return next();
  } catch (error) {
    res.status(500).json({ error: "Token no válido" });
  }
}

export function getTokenData(req: any, res: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  try {
    jwt.verify(token, secretKey, function (err: any, decoded: any) {
      res = {
        id: decoded.id,
        role: decoded.role
      };
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
}


