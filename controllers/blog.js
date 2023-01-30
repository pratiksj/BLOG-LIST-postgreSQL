const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { SECRET } = require("../utils/config");
const { Op } = require("sequelize");
const { Blog, User } = require("..//model/index");
//const { User } = require("../model/user");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

router.get("/", async (req, res) => {
  //const blogs = await Blog.findAll();

  const where = {};
  if (req.query.search) {
    where.title = { [Op.substring]: req.query.search };
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ["userID"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
  });
  res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res) => {
  const blog = await Blog.create({
    ...req.body,
    userId: req.decodedToken.id,
  });

  res.json(blog);

  // const newBlog = {
  //   author: req.body.author,
  //   url: req.body.url,
  //   title: req.body.title,
  //   likes: req.body.likes,
  //   userId: req.user.id,
  // };
  // const blog = await Blog.create(newBlog);
});

router.get("/:id", blogFinder, async (req, res) => {
  //const blog = await Blog.findByPk(req.params.id);
  if (req.blog) {
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.delete("/:id", tokenExtractor, async (req, res) => {
  const blogToDelete = await Blog.findByPk(req.params.id);
  console.log(blogToDelete, "this is to delete");
  if (req.decodedToken.id === blogToDelete.userId) {
    await Blog.destroy({ where: { id: req.params.id } });
    res.status(200);
  } else {
    res.json({ error: "You are not authorized to delete" });
  }
});

router.put("/:id", blogFinder, async (req, res) => {
  //const blog = await Blog.findByPk(req.params.id);
  //   if (req.blog) {
  //     //req.blog.likes = req.body.likes;
  //     req.blog.likes += 1;
  //     await req.blog.save();
  //     res.json(req.blog);
  //     //res.json({ likes: req.blog.likes }); getting likes only
  //   } else {
  //     res.status(404).end();
  //   }
  req.blog.likes = req.body.likes;
  //console.log(req.blog.toJSON());
  //console.log(req.body.likes, "hellow");
  await req.blog.save();
  res.json(req.blog);
  //res.json({"likes":req.blog.likes}) getting likes only
});

module.exports = router;
