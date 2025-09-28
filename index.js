const express = require('express');
const { url } = require('inspector');
const app = express();
const port = process.env.PORT || 8080;
const{v4 : uuidv4} =  require('uuid');
const methodOverride = require('method-override');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.json());

const paths = require("path");
app.set('views', paths.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(paths.join(__dirname, 'public'))); 
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


app.get('/posts', (req,res) => {
    res.render("index.ejs", {posts});
});

app.get('/posts/new',(req,res) => {
    res.render("new.ejs");
});

app.get('/posts/:id',(req,res)=> {
    let {id} = req.params;
    let post = posts.find((p) => id === p.id);
    if(post){
        res.render("show.ejs",{post});
    }
    else{
        res.send("Not a valid id");
    }
    
});


app.post('/posts',(req,res)=>{
    let {username,content} = req.body;
    let id = uuidv4();
    posts.push({id,username,content});
    res.redirect('/posts');
});

app.patch('/posts/:id',(req,res) => {
    let {id} = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => id === p.id);
    post.content = newContent;
    console.log(post);
    res.redirect('/posts');
})

app.get('/posts/:id/edit',(req,res) => {
    let {id} = req.params;
    let post = posts.find((p) => id === p.id);
    if (!post) {
        return res.status(404).send("Post not found");
    }

    res.render('update.ejs', { post });
})

app.delete('/posts/:id',(req,res) => {
    let {id} = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect('/posts');
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});