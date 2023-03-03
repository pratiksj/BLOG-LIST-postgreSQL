const express = require("express");
require("express-async-errors");
const app = express();
//app.use(express.json());
const { PORT } = require("./utils/config");
const { connectToDatabase } = require("./utils/db");

const blogsRouter = require("./controllers/blog");
const usersRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");
const router = require("./controllers/author");
const readingRouter = require("./controllers/reading");
const logoutRouter = require("./controllers/logout");

app.use(express.json());

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/author", router);
app.use("/api/reading", readingRouter);
app.use("/api/logout", logoutRouter);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
