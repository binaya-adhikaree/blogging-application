const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");  // Assuming you're using JWT for authentication

// Handle user sign up
async function handleSignup(req, res) {
    const { fullName, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        return res.render("signup", {
            error: "Account with this email already exists"
        })
    }

    await User.create({
        fullName,
        email,
        password
    });

    return res.redirect("/user/signin");
}

// Handle user sign in
async function handleSignin(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.end("Invalid email or password");
        }

        // Compare the provided password with the stored hashed password
        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            return res.render("signin", {
                error: "Incorrect Email or Password"
            });
        }

        // If the password matches, generate a token (example: JWT token)
        const token = jwt.sign({ userId: user._id }, "kaizennoob", { expiresIn: "1d" });
        return res.cookie("token", token).redirect("/");
    } catch (err) {
        console.log(err)
        return res.status(500);
    }
}

function handleLogout(req, res) {
    res.clearCookie("token").redirect("/")
}

module.exports = {
    handleSignup,
    handleSignin,
    handleLogout
};
