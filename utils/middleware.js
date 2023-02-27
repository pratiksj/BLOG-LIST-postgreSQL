const jwt = require("jsonwebtoken");
const { SECRET } = require("../utils/config");
const Session = require("../model/session");
const User = require("../model/user");

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

const sessionChecker = async (req, res, next) => {
  const { token } = req;
  const session = await Session.findOne({ where: { token }, include: User });
  if (!session || session.user.disabled) {
    return res.status(401).json({ error: "session has expired" });
  }
  req.session = session;
  next();
};

module.exports = { tokenExtractor, sessionChecker };
