const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./reading_list");
//const Session = require("./session");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: "marked_blogs" });
Blog.belongsToMany(User, { through: ReadingList, as: "users_marked" });

// User.hasMany(Session);
// Session.belongsTo(User);

module.exports = {
  Blog,
  User,
  ReadingList,
  //Session,
};
