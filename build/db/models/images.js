"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.images = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("./../connection"));
exports.images = connection_1.default.define("images", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    comment: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    numLikes: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    tagId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
});
