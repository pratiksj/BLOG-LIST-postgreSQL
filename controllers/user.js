const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();
const { User, Blog, ReadingList } = require("../model");

const userFinder = async (req, res, next) => {
  req.user = await User.findOne({ where: { username: req.params.username } });
  next();
};

usersRouter.get("/", async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["passwordHash"] },
    include: [
      {
        model: Blog,
        attributes: { exclude: ["userId"] },
      },
      {
        model: Blog,
        as: "marked_blogs",
        attributes: { exclude: ["userId"] },
        through: {
          attributes: ["isRead"],
        },
        // include: {
        //   model: User,
        //   attributes: ["name"],
        // },
      },
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
    attributes: { exclude: ["passwordHash"] },
    include: [
      {
        model: Blog,
        as: "marked_blogs",
        attributes: { exclude: ["userId"] },
        through: {
          //attributes: ["id", "isRead"],
          attributes: ["id", "isRead"],
        },
      },
    ],
  });

  res.json(user);
});

usersRouter.put("/:username", userFinder, async (req, res) => {
  req.user.username = req.body.username;
  await req.user.save();
  res.json(req.user);
});

module.exports = usersRouter;
