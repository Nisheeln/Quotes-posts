require("dotenv").config();
const mongoose = require("mongoose");
const Post = require("./models/Post"); // Make sure the path is correct
const { v4: uuidv4 } = require("uuid"); // optional if you want ids, but not needed

// Sample posts
const posts = [
  { username: "Oscar Wilde", content: "Be yourself; everyone else is already taken." },
  { username: "Steve Jobs", content: "Stay hungry. Stay foolish." },
  { username: "Rosa Nouchette Carey", content: "Do it with passion or not at all." },
  { username: "Latin Proverb", content: "Fortune favors the bold." },
  { username: "George Bernard Shaw", content: "Life isn’t about finding yourself. It’s about creating yourself." },
  { username: "D.H. Sidebottom", content: "Stars can’t shine without darkness." },
  { username: "Sam Levenson", content: "Don’t watch the clock; do what it does. Keep going." },
  { username: "George Bernard Shaw", content: "Don’t wait for opportunity. Create it." },
  { username: "Robert Collier", content: "Success is the sum of small efforts repeated day in and day out." }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log("✅ MongoDB connected");

  // Insert posts if collection is empty
  const count = await Post.countDocuments();
  if (count === 0) {
    await Post.insertMany(posts);
    console.log("✅ Sample posts inserted");
  } else {
    console.log("⚠️ Posts already exist in DB, skipping insertion");
  }

  mongoose.connection.close();
})
.catch(err => console.error("❌ Error:", err));
