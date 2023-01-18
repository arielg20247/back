"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./../db/models/user");
const images_1 = require("./../db/models/images");
const comments_1 = require("./../db/models/comments");
const tags_1 = require("./../db/models/tags");
const likes_1 = require("../db/models/likes");
const associations_1 = __importDefault(require("../db/associations"));
const createTable = async () => {
    (0, associations_1.default)();
    await user_1.users.sync({ force: true });
    await tags_1.tags.sync({ force: true });
    await images_1.images.sync({ force: true });
    await comments_1.comments.sync({ force: true });
    await likes_1.likes.sync({ force: true });
};
createTable();
