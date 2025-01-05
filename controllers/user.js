const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");  // Assuming you're using JWT for authentication

// Handle user sign up
async function handleSignup(req, res) {
    const { fullName, email, password } = req.body;

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
        fullName,
        email,
        password: hashedPassword,  // Save the hashed password
    });

    return res.redirect("/user/signin");
}

// Handle user sign in
async function handleSignin(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.end("Invalid email or password");
    }

    // Compare the provided password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log(isPasswordCorrect)
    if (!isPasswordCorrect) {

        return res.render("signin", {
            error: "Incorrect Email or Password"
        });
    }

    // If the password matches, generate a token (example: JWT token)
    const token = jwt.sign({ userId: user._id }, "kaizennoob", { expiresIn: "1d" });
    return res.cookie("token", token).redirect("/");
}

function handleLogout(req, res) {
    res.clearCookie("token").redirect("/")
}

module.exports = {
    handleSignup,
    handleSignin,
    handleLogout
};
