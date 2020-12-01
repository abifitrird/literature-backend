"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Literature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // any literature can belongs to many users
      Literature.belongsToMany(models.User, {
        as: "users",
        through: {
          model: "Collection",
          as: "collection",
        },
      });

      // any literature can belongs to many users
      Literature.belongsToMany(models.User, {
        as: "authors",
        through: {
          model: "Author",
          as: "info",
        },
      });
    }
  }
  Literature.init(
    {
      title: DataTypes.STRING,
      publication: DataTypes.DATEONLY,
      pages: DataTypes.INTEGER,
      isbn: DataTypes.STRING,
      author: DataTypes.STRING,
      status: DataTypes.STRING,
      file: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Literature",
    }
  );
  return Literature;
};
