const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const express = require("express");
const path = require("path")
const { connectToDatabase } = require("./connect")
const cookieParser = require("cookie-parser")

const Blog = require("./models/blog")

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(checkForAuthenticationCookie("token"))

const userRoute = require("./routes/user");
const userBlog = require("./routes/blog");


app.use("/user", userRoute);
app.use("/blog", userBlog);


connectToDatabase("mongodb+srv://binaya_adhikari:binayaheroholah@cluster0.n684t.mongodb.net/blogify?retryWrites=true&w=majority&appName=Cluster0").then(() => console.log("mongoDb connected"))

app.use(express.static(path.resolve('./public')))

app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({});

    res.render("home", {
        user: req.user,
        blogs: allBlogs
    })
})



app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.listen(PORT, (() => console.log(`server started at port : ${PORT}`)));