"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenData = exports.checktoken = exports.secretKey = void 0;
const jwt = require("jsonwebtoken");
exports.secretKey = "thiIsMyPassword";
function checktoken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    try {
        jwt.verify(token, exports.secretKey, function (err, decoded) {
            res = {
                id: decoded.id,
                role: decoded.role
            };
        });
        return next();
    }
    catch (error) {
        res.status(500).json({ error: "Token no válido" });
    }
}
exports.checktoken = checktoken;
function getTokenData(req, res) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    try {
        jwt.verify(token, exports.secretKey, function (err, decoded) {
            res = {
                id: decoded.id,
                role: decoded.role
            };
        });
        return res;
    }
    catch (error) {
        console.log(error);
    }
}
exports.getTokenData = getTokenData;
