const sequelize = require("sequelize");
const { Blog } = require("../model");
const router = require("express").Router();

router.get("/", async (req, res) => {
  const author = await Blog.findAll({
    attributes: [
      "author",
    [sequelize.fn("COUNT", sequelize.col("title")), "articles"],
    [sequelize.fn("SUM", sequelize.col("likes")), "likes"],
    ],
     group: ["author"],
     order:[["likes","DESC"]],
  });
  console.log(author, "this is from author");
  res.json(author);
});

module.exports = router;
