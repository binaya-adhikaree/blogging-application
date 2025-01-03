const User = require("../models/user");

async function handleSignup(req, res) {
    const { fullName, email, password } = req.body;
   

    await User.create({
        fullName, email, password,
    })
    return res.redirect("/")
}



module.exports = {
    handleSignup,
}