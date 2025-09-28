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
    {
        id: uuidv4(),
        username: "Oscar Wilde",
        content: "Be yourself; everyone else is already taken."
    },
    {
        id: uuidv4(),
        username: "Steve Jobs",
        content: "Stay hungry. Stay foolish."
    },
    {
        id: uuidv4(),
        username: "Rosa Nouchette Carey",
        content: "Do it with passion or not at all."
    },
    {
        id: uuidv4(),
        username: "Latin Proverb",
        content: "Fortune favors the bold."
    },
    {
        id: uuidv4(),
        username: "George Bernard Shaw",
        content: "Life isn’t about finding yourself. It’s about creating yourself."
    },
    {
        id: uuidv4(),
        username: "D.H. Sidebottom",
        content: "Stars can’t shine without darkness."
    },
    {
        id: uuidv4(),
        username: "Sam Levenson",
        content: "Don’t watch the clock; do what it does. Keep going."
    },
    {
        id: uuidv4(),
        username: "George Bernard Shaw",
        content: "Don’t wait for opportunity. Create it."
    },
    {
        id: uuidv4(),
        username: "Robert Collier",
        content: "Success is the sum of small efforts repeated day in and day out."
    }
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
