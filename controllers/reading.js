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

readingRouter.put("/:id", tokenExtractor, async (req, res) => {
  const readingList = await ReadingList.findByPk(req.params.id);
  //console.log(JSON.stringify(readingList), "this just for testing");

  if (!readingList) {
    return res.status(404).json({ error: "Reading list item not found" });
  }
  const user = await User.findByPk(req.decodedToken.id);
  console.log(JSON.stringify(user), "testing for token");

  if (readingList.userId !== user.id) {
    res.status(401).json({ error: "Unauthorized" });
  }
  if (readingList) {
    readingList.isRead = req.body.isRead;
    await readingList.save();
    res.json(readingList);
  } else {
    res.status(404).end();
  }
});

readingRouter.delete("/:id", async (req, res) => {
  const reading = await ReadingList.findByPk(req.params.id);
  if (reading) {
    await reading.destroy();
  }
  res.status(204).end();
});

module.exports = readingRouter;
