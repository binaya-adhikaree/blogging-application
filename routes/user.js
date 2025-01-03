const express = require("express");
const router = express.Router();
const { handleSignup } = require("../controllers/user")
router.get("/signin", (req, res) => {
    return res.render("signin")
});

router.get("/signup", (req, res) => {
    return res.render("signup")
});


router.post("/signup", handleSignup)


module.exports = router;