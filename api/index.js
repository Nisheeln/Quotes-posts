require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const Post = require("../models/Post");
const User = require("../models/User");

const app = express();

// ===== Database Connection =====
const MONGO_URI = process.env.MONGODB_URI;
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Atlas Connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// ===== Middleware =====
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public")));

// ===== Sessions =====
app.use(session({
    secret: process.env.SESSION_SECRET || "secretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// ===== Middleware to pass authentication status =====
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.userId ? true : false;
    next();
});

// ===== Auth Middleware =====
function isAuthenticated(req, res, next) {
    if (req.session.userId) return next();
    res.redirect("/login");
}

// ===== Public Routes =====
app.get("/", (req, res) => {
    if (req.session.userId) return res.redirect("/posts");
    res.redirect("/login");
});

app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = new User({ username, password: hashedPassword });
        await user.save();
        req.session.userId = user._id;
        res.redirect("/posts");
    } catch (err) {
        console.error(err);
        res.redirect("/signup");
    }
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.redirect("/login");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.redirect("/login");

    req.session.userId = user._id;
    res.redirect("/posts");
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

// ===== Protected Routes =====
app.get("/posts", isAuthenticated, async (req, res) => {
    const posts = await Post.find({});
    res.render("index.ejs", { posts });
});

app.get("/posts/new", isAuthenticated, (req, res) => res.render("new.ejs"));

app.get("/posts/:id", isAuthenticated, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send("Not a valid id");
        res.render("show.ejs", { post });
    } catch {
        res.status(404).send("Not a valid id");
    }
});

app.post("/posts", isAuthenticated, async (req, res) => {
    const { username, content } = req.body;
    await Post.create({ username, content });
    res.redirect("/posts");
});

app.get("/posts/:id/edit", isAuthenticated, async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");
    res.render("update.ejs", { post });
});

app.patch("/posts/:id", isAuthenticated, async (req, res) => {
    const { content } = req.body;
    await Post.findByIdAndUpdate(req.params.id, { content });
    res.redirect("/posts");
});

app.delete("/posts/:id", isAuthenticated, async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/posts");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
