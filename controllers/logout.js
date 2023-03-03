const logoutRouter = require("express").Router();
const Session = require("../model/session");
const { tokenExtractor, sessionChecker } = require("../utils/middleware");

logoutRouter.delete(
  "/:id",
  tokenExtractor,
  sessionChecker,
  async (req, res) => {
    //const session = req.session;
    //console.log(JSON.stringify(session), "janakpur");
    //console.log(JSON.stringify(session.id), "janakpur");
    const session = await Session.findByPk(req.params.id);
    console.log(JSON.stringify(session), "janakpur");

    // const session = req.session;
    //const session = req.
    //   if (session) {
    //     await Session.destroy({ where: { id: session.id } });
    //     res.json({ message: "logout successful" });
    //   } else {
    //     res.json({ message: "Already logout" });
    //   }
    if (session) {
      await Session.destroy({ where: { id: req.params.id } });
      res.json({ message: "logout Successful" });
    } else {
      res.json({ error: "You are not authorized to delete" });
    }
  }
);

module.exports = logoutRouter;
