require("dotenv").config();
const { Sequelize, QueryTypes, Model, DataTypes } = require("sequelize");
const express = require("express");
const app = express();
app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
      //allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blog",
  }
);

app.get("/api/blogs", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

app.get("/api/blogs/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    console.log(blog);
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

//app.post("/api/blogs", async (req, res) => {

//   try {
//     const blog = await Blog.create({
//       author: req.body.author,
//       url: req.body.url,
//       title: req.body.title,
//       likes: req.body.likes,
//     });
//     res.json(blog);
//   } catch (error) {
//     return res.status(400).json({ error });
//   }

//});

app.post("/api/blogs", async (req, res) => {
  try {
    console.log(req.body, "form resquest");
    const blog = await Blog.create(req.body);
    console.log(blog.toJSON(), "snake");
    return res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});