const bcrypt = require("bcryptjs");
const router = require("express").Router();
const { User, Blog } = require("../model/index");

router.get("/", async (req, res) => {
  console.log("the get entere in user");
  const users = await User.findAll();

  // const users = await User.findAll({
  //   include: {
  //     model: Blog,
  //     attributes: { exclude: ["userId"] },
  //   },
  // });ole.,
  res.json(users);
});

router.post("/", async (req, res) => {
  // try {
  //   const user = await User.create(req.body);
  //   res.json(user);
  // } catch (error) {
  //   return res.status(400).json({ error });
  // }
  const { username, name, password } = req.body;
  const saltRounds = 10;
  const passwordhash = await bcrypt.hash(password, saltRounds);
  const user = {
    name,
    username,
    passwordhash,
  };
  //console.log("the be usernew ", user);
  const newUser = await User.create(user);
  return res.status(201).json(newUser);
});

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
