require('dotenv').config();

const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const express = require("express");
const path = require("path")
const cookieParser = require("cookie-parser")

const Blog = require("./models/blog")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(checkForAuthenticationCookie("token"))

const userRoute = require("./routes/user");
const userBlog = require("./routes/blog");
const { default: mongoose } = require("mongoose");


app.use("/user", userRoute);
app.use("/blog", userBlog);

mongoose.connect(process.env.MONGO_URL).then(() => console.log("mongoDb connected"))


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