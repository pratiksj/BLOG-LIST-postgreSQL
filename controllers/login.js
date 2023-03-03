const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = require("express").Router();

const config = require("../utils/config");
const User = require("../model/user");
const Session = require("../model/session");

router.post("/", async (request, response) => {
  const { username, password } = request.body;
  //console.log(request, "you");

  const user = await User.findOne({
    where: {
      username: username,
    },
  });

  //console.log(user, "this is from user");
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  // if (user.disabled) {
  //   return response.status(401).json({ error: "user account is disabled" });
  // }
  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, config.SECRET);
  await Session.create({
    token,
    userId: user.id,
    expiresAt: new Date(Date.now() + 2 * 60 * 1000),
  });
  //console.log(Date.now(), "this is from date");
  //const session = await Session.create({ token });
  //{ expiresIn: 60 }
  response
    .status(200)
    .send({ token, username: user.username, name: user.name, id: user._id });
});

module.exports = router;
