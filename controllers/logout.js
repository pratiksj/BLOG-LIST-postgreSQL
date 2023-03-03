const logoutRouter = require("express").Router();
const Session = require("../model/session");
const { tokenExtractor, sessionChecker } = require("../utils/middleware");

logoutRouter.delete("/", tokenExtractor, sessionChecker, async (req, res) => {
  const session = req.session;

  if (session) {
    await Session.destroy({ where: { id: session.id } });
    res.json({ message: "logout Successful" });
  } else {
    res.json({ error: "You are not authorized to delete" });
  }
});

module.exports = logoutRouter;
