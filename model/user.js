const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../utils/db");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      error: ["Validation is Email on username failed"],
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "user",
  }
);

module.exports = User;

// const { DataTypes } = require("sequelize");

// module.exports = {
//   up: async ({ context: queryInterface }) => {
//     // await queryInterface.createTable('teams', {
//     //   id: {
//     //     type: DataTypes.INTEGER,
//     //     primaryKey: true,
//     //     autoIncrement: true
//     //   },
//     //   name: {
//     //     type: DataTypes.TEXT,
//     //     allowNull: false,
//     //     unique: true
//     //   },
//     // })
//     await queryInterface.createTable("reading_list", {
//       id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//       },
//       user_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: { model: "users", key: "id" },
//       },
//       blog_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: { model: "blogs", key: "id" },
//       },
//       is_read: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//       },
//     });
//   },
//   down: async ({ context: queryInterface }) => {
//     await queryInterface.dropTable("reading_list");
//     //await queryInterface.dropTable('memberships')
//   },
// };
