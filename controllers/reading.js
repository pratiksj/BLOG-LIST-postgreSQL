const readingRouter = require("express").Router();
const { Blog, User, ReadingList } = require("../model/index");
const { tokenExtractor } = require("../utils/middleware");

readingRouter.get("/", async (req, res, next) => {
  const reading = await ReadingList.findAll();
  console.log(reading, "this is from reading");
  res.json(reading);
});

// router.post("/", tokenExtractor, async (req, res, next) => {
//   const user = await User.findByPk(req.decodedToken.id);
//   const blog = await ReadingList.create({
//     user_id: user.id,
//     blog_id: req.body.blogId,
//   });
//   return res.json(blog);
// });

module.exports = readingRouter;
