const express = require("express");
const router = express.Router();
const { handleSignup, handleSignin, handleLogout } = require("../controllers/user")
const User = require("../models/user")


router.get("/signin", (req, res) => {
    return res.render("signin")
});

router.post("/signin", handleSignin)

router.get("/signup", (req, res) => {
    return res.render("signup")
});

router.post("/signup", handleSignup);

router.get("/logout", handleLogout);


module.exports = router;