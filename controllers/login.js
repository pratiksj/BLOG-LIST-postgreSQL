const jwt = require("jsonwebtoken");
//const bcrypt = require("bcryptjs");

const router = require("express").Router();

const { SECRET } = require("../utils/config");
const User = require("../model/user");

router.post("/", async (request, response) => {
  const body = request.body;
  //const { username, password } = request.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  // const passwordCorrect =
  //   user === null ? false : await bcrypt.compare(password, user.passwordHash);

  const passwordCorrect = body.password === "secret";

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = router;
