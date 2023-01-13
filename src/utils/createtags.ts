import { users } from "../db/models/user";
import { comments } from "../db/models/comments";
import { tags } from "../db/models/tags";
import { images } from "../db/models/images";

import "../db/associations";

let tagList = ["naturaleza", "ficción", "animales", "series"];

let createTags = async () => {
  tagList.forEach(
    async (value) =>
      await tags.create({
        tag: value,
      })
  );
};

createTags();
