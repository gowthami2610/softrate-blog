
const express = require("express");
const router = express.Router();

const Article = require("../models/Article");
const verifyAdmin = require("../middleware/authMiddleware");

// GET: Retrieve all published articles (Public)
router.get("/", async (req, res) => {
    try {
        const articles = await Article.find({ status: "published" })
            .sort({ createdAt: -1 });

        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET: Retrieve all articles for admin (Protected)
router.get("/manage", verifyAdmin, async (req, res) => {
    try {
        const articles = await Article.find()
            .sort({ createdAt: -1 });

        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET: Retrieve one published article (Public)
router.get("/:slug", async (req, res) => {
    try {
        const article = await Article.findOne({
            slug: req.params.slug,
            status: "published"
        });

        if (!article) {
            return res.status(404).json({
                message: "Article not found"
            });
        }

        res.json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST: Create an article (Protected)
router.post("/", verifyAdmin, async (req, res) => {
    try {
        const article = new Article(req.body);
        const savedArticle = await article.save();

        res.status(201).json(savedArticle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT: Update an article (Protected)
router.put("/:id", verifyAdmin, async (req, res) => {
    try {
        const updatedArticle = await Article.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedArticle) {
            return res.status(404).json({
                message: "Article not found"
            });
        }

        res.json(updatedArticle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE: Delete an article (Protected)
router.delete("/:id", verifyAdmin, async (req, res) => {
    try {
        const deletedArticle = await Article.findByIdAndDelete(
            req.params.id
        );

        if (!deletedArticle) {
            return res.status(404).json({
                message: "Article not found"
            });
        }

        res.json({ message: "Article deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
