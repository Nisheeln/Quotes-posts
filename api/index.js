const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");

const Post = require("./models/Post");

const app = express();

// ===== Database Connection (Atlas) =====
// Use environment variable (set in Vercel Dashboard)
// Example: mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/postsApp
const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Atlas Connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ===== Middleware =====
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// ⚠️ On Vercel, server-side rendering with EJS is tricky
// If you want to keep EJS, you must serve it via Express
// Vercel works better with JSON APIs or Next.js frontend
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public")));

// ===== Routes =====
app.get("/", (req, res) => res.redirect("/posts"));

// Show all posts
app.get("/posts", async (req, res) => {
  const posts = await Post.find({});
  res.render("index.ejs", { posts });
});

// New post form
app.get("/posts/new", (req, res) => res.render("new.ejs"));

// Show single post
app.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Not a valid id");
    res.render("show.ejs", { post });
  } catch {
    res.status(404).send("Not a valid id");
  }
});

// Create new post
app.post("/posts", async (req, res) => {
  const { username, content } = req.body;
  await Post.create({ username, content });
  res.redirect("/posts");
});

// Edit form
app.get("/posts/:id/edit", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found");
  res.render("update.ejs", { post });
});

// Update post
app.patch("/posts/:id", async (req, res) => {
  const { content } = req.body;
  await Post.findByIdAndUpdate(req.params.id, { content });
  res.redirect("/posts");
});

// Delete post
app.delete("/posts/:id", async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect("/posts");
});

module.exports = app;
