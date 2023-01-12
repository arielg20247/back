import { users } from "./models/user";
import { images } from "./models/images";
import { comments } from "./models/comments";
import { tags } from "./models/tags";

images.belongsTo(users, {
  foreignKey: {
    name: "userId",
  },
});

images.belongsTo(tags, {
  foreignKey: {
    name: "tagId",
  },
});

comments.belongsTo(users, {
  foreignKey: {
    name: "userId",
  },
});

comments.belongsTo(images, {
  foreignKey: {
    name: "imageId",
  },
});
