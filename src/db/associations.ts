import { users } from "./models/user";
import { images } from "./models/images";
import { comments } from "./models/comments";

images.belongsTo(users, {
  foreignKey: {
    name: "userId",
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
