const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        
        if (!tokenCookieValue) {
            return next();  // Ensure next() is called if no token exists
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) {
            console.error("Invalid token:", error.message);
        }
        
        next();  // Ensure next() is called even after catching errors
    };
}

module.exports = {
    checkForAuthenticationCookie
};
