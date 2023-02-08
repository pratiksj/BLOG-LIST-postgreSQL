const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = require("express").Router();

const config = require("../utils/config");
const User = require("../model/user");

router.post("/", async (request, response) => {
  const { username, password } = request.body;
  console.log(request, "you");

  const user = await User.findOne({
    where: {
      username: username,
    },
  });

  console.log(user, "this is from user");
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, config.SECRET);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name, id: user._id });
});

module.exports = router;
