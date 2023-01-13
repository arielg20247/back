import { DataTypes } from "sequelize";
import database from "./../connection";

export const users = database.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        unique:true,
        allowNull:false
      },
    name: {
      type: DataTypes.STRING,
      allowNull:false
    },
    password: {
      type: DataTypes.STRING,
      allowNull:false
    },
    role: {
      type: DataTypes.STRING,
      allowNull:false,
      defaultValue: "ROLE_USER",
    },
    picture: {
      type: DataTypes.STRING,
      allowNull:true
    },
  },
  {
    timestamps: false,
  }
);



