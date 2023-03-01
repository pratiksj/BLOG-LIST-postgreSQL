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
      return res.status(401).json({ error: "token invalid 1" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

const sessionChecker = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (!authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "unauthorised token" });
  }
  const token = authorization.substring(7);

  const session = await Session.findOne({ where: { token } });
  console.log(JSON.stringify(session), "this is from session");
  if (!session || new Date(session.expiresAt) < new Date()) {
    return res.status(401).json({ error: "session has expired" });
  }
  req.session = session;
  next();
};

module.exports = { tokenExtractor, sessionChecker };
//, include: User
