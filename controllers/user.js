const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();
const { User, Blog } = require("../model");

const userFinder = async (req, res, next) => {
  req.user = await User.findOne({ where: { username: req.params.username } });
  next();
};

usersRouter.get("/", async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Blog,
        attributes: { exclude: ["userId"] },
      },
      // {
      //   model: Blog,
      //   as: "marked_blogs",
      //   attributes: { exclude: ["userId"] },
      //   through: {
      //     attributes: [],
      //   },
      //   include: {
      //     model: User,
      //     attributes: ["name"],
      //   },
      // },
    ],
  });
  res.json(users);
});

usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = {
    name,
    username,
    passwordHash,
  };
  //console.log("the be usernew ", user);
  const newUser = await User.create(user);
  res.status(201).json(newUser);
});

usersRouter.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Blog,
      },
      {
        model: Blog,
        as: "marked_blogs",
        attributes: { exclude: ["userId"] },
        through: {
          attributes: [],
        },
        include: {
          model: User,
          attributes: ["name"],
        },
      },
    ],
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

usersRouter.put("/:username", userFinder, async (req, res) => {
  req.user.username = req.body.username;
  await req.user.save();
  res.json(req.user);
});

module.exports = usersRouter;
