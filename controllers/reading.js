const readingRouter = require("express").Router();
const { Blog, User, ReadingList } = require("../model");
const { tokenExtractor } = require("../utils/middleware");

readingRouter.get("/", async (req, res, next) => {
  const reading = await ReadingList.findAll();
  //console.log(reading, "this is from reading");
  res.json(reading);
});

readingRouter.post("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  //console.log(JSON.stringify(user), "this is from decoded token");

  const blog = await ReadingList.create({
    // ...req.body,
    // userId: user.id,
    userId: user.id,
    blogId: req.body.blogId,
  });
  return res.json(blog);
});

module.exports = readingRouter;
