import { DataTypes } from "sequelize";
import database from "./../connection";
export const likes = database.define(
  "likes",
  {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      imageId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
  },
  {
    timestamps: false,
  }
);

