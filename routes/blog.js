const { Router } = require("express");
const multer = require("multer");
const path = require("path")

const Blog = require("../models/blog");
const Comment = require("../models/comment");
const User = require("../models/user");

const router = Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}- ${file.originalname}`;
        cb(null, fileName)
    }
})
const upload = multer({ storage: storage })

router.get("/add-new", (req, res) => {
    return res.render("blog", {
        user: req.user,
    })
})


router.get("/:id", async (req, res) => {
    // Populate the createdBy field correctly
    const blog = await Blog.findById(req.params.id).populate("createdBy");// Check if `createdBy` is populated correctly
    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
   

    return res.render("blogs", {
        user: req.user,
        blog,
        comments,
        
    });
});


router.post('/comment/:blogId', async (req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId.trim(),
        createdBy: req.user.userId
    });
    return res.redirect(`/blog/${req.params.blogId.trim()}`)
})


router.post("/", upload.single("coverImage"), async (req, res) => {

    const { title, body } = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user.userId,
        coverImageURL: `/uploads/${req.file.filename}`,

    });
    return res.redirect(`/blog/${blog._id}`);
});





module.exports = router; 