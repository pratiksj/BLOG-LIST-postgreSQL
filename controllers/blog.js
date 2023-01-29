const router = require("express").Router();

const { Blog } = require("../model");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post("/", async (req, res) => {
  const blog = await Blog.create(req.body);
  res.json(blog);
  //    catch (error) {
  //     return res.status(400).json({ error });
  //   }
});

router.get("/:id", blogFinder, async (req, res) => {
  //const blog = await Blog.findByPk(req.params.id);
  if (req.blog) {
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.delete("/:id", blogFinder, async (req, res) => {
  //const blog = await Blog.findByPk(req.params.id);
  if (req.blog) {
    await req.blog.destroy();
  }
  res.status(204).end();
});

router.put("/:id", blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes;
  //console.log(req.blog.toJSON())
  //console.log(req.body.likes, "hellow");
  await req.blog.save();
  res.json(req.blog);
  //res.json({"likes":req.blog.likes}) getting likes only
});

module.exports = router;
