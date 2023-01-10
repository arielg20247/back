import { DataTypes } from "sequelize";
import database from "./../connection";
export const images = database.define(
  "images",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
  },
  {
    timestamps: false,
  }
);


const createTable = async () => {
  await images.sync();
};

createTable();
