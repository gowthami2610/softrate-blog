
const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Admin login
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check admin credentials
    if (
        username !== process.env.ADMIN_USERNAME ||
        password !== process.env.ADMIN_PASSWORD
    ) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    // Generate authentication token
    const token = jwt.sign(
        { username: username },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );

    res.json({
        message: "Login successful",
        token: token
    });
});

module.exports = router;
