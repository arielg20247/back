"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associations = void 0;
const user_1 = require("./models/user");
const images_1 = require("./models/images");
const comments_1 = require("./models/comments");
const tags_1 = require("./models/tags");
const likes_1 = require("./models/likes");
function associations() {
    images_1.images.belongsTo(user_1.users, {
        foreignKey: {
            name: "userId",
        },
    });
    images_1.images.belongsTo(tags_1.tags, {
        foreignKey: {
            name: "tagId",
        },
    });
    comments_1.comments.belongsTo(user_1.users, {
        foreignKey: {
            name: "userId",
        },
    });
    comments_1.comments.belongsTo(images_1.images, {
        foreignKey: {
            name: "imageId",
        },
    });
    likes_1.likes.belongsTo(user_1.users, {
        foreignKey: {
            name: "userId",
        },
    });
    likes_1.likes.belongsTo(images_1.images, {
        foreignKey: {
            name: "imageId",
        },
    });
}
exports.associations = associations;
associations();
exports.default = associations;
