"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likes = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("./../connection"));
exports.likes = connection_1.default.define("likes", {
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    imageId: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
}, {
    timestamps: false,
});
