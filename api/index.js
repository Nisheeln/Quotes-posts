const express = require("express");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public")));

let posts = [
  { id: uuidv4(), username: "Nisheel", content: "Hii how are you?" },
  { id: uuidv4(), username: "Anish", content: "Hello" },
  { id: uuidv4(), username: "Rahul", content: "Hardworker" },
];

app.get("/", (req, res) => res.redirect("/posts"));

app.get("/posts", (req, res) => res.render("index.ejs", { posts }));

app.get("/posts/new", (req, res) => res.render("new.ejs"));

app.get("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (post) return res.render("show.ejs", { post });
  res.status(404).send("Not a valid id");
});

app.post("/posts", (req, res) => {
  const { username, content } = req.body;
  posts.push({ id: uuidv4(), username, content });
  res.redirect("/posts");
});

app.get("/posts/:id/edit", (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).send("Post not found");
  res.render("update.ejs", { post });
});

app.patch("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (post) post.content = req.body.content;
  res.redirect("/posts");
});

app.delete("/posts/:id", (req, res) => {
  posts = posts.filter((p) => p.id !== req.params.id);
  res.redirect("/posts");
});

module.exports = app;
