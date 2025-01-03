const express = require("express");
const path = require("path")
const { connectToDatabase } = require("./connect")


const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userRoute = require("./routes/user");


app.use("/user", userRoute)

connectToDatabase("mongodb+srv://binaya_adhikari:binayaheroholah@cluster0.n684t.mongodb.net/blogify?retryWrites=true&w=majority&appName=Cluster0").then(() => console.log("mongoDb connected"))


app.get("/", (req, res) => {
    res.render("home")
})



app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.listen(PORT, (() => console.log(`server started at port : ${PORT}`)));