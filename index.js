const express = require("express");
const { v4: uuidv4 } = require("uuid"); // v8.3.2 installed
const methodOverride = require("method-override");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public")));

// Sample posts
let posts = [
  { id: uuidv4(), username: "Nisheel", content: "Hii how are you?" },
  { id: uuidv4(), username: "Anish", content: "Hello" },
  { id: uuidv4(), username: "Rahul", content: "Hardworker" },
];

// Home route → redirect to /posts
app.get("/", (req, res) => {
  res.redirect("/posts");
});

// Show all posts
app.get("/posts", (req, res) => {
  res.render("index.ejs", { posts });
});

// Create new post form
app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});

// Show single post
app.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => id === p.id);
  if (post) return res.render("show.ejs", { post });
  res.status(404).send("Not a valid id");
});

// Create post
app.post("/posts", (req, res) => {
  const { username, content } = req.body;
  const id = uuidv4();
  posts.push({ id, username, content });
  res.redirect("/posts");
});

// Edit post form
app.get("/posts/:id/edit", (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => id === p.id);
  if (!post) return res.status(404).send("Post not found");
  res.render("update.ejs", { post });
});

// Update post
app.patch("/posts/:id", (req, res) => {
  const { id } = req.params;
  const newContent = req.body.content;
  const post = posts.find((p) => id === p.id);
  if (post) post.content = newContent;
  res.redirect("/posts");
});

// Delete post
app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  posts = posts.filter((p) => id !== p.id);
  res.redirect("/posts");
});

module.exports = app;
