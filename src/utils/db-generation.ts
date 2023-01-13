import { users } from "./../db/models/user";
import { images } from "./../db/models/images";
import { comments } from "./../db/models/comments";
import { tags } from "./../db/models/tags";
import associations from "../db/associations";

const createTable = async () => {
  associations();
  await users.sync({ force: true });
  await tags.sync({ force: true });
  await images.sync({ force: true });
  await comments.sync({ force: true });
};


createTable();
