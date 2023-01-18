"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comments = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("./../connection"));
exports.comments = connection_1.default.define("comments", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    comment: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    imageId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
});
