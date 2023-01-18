"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tags_1 = require("../db/models/tags");
require("../db/associations");
let tagList = ["naturaleza", "ficción", "animales", "series"];
let createTags = async () => {
    tagList.forEach(async (value) => await tags_1.tags.create({
        tag: value,
    }));
};
createTags();
