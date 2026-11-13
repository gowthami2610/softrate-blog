
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        slug: {
            type: String,
            required: true,
            unique: true
        },

        description: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        author: {
            type: String,
            default: "Admin"
        },

        image: {
            type: String,
            default: ""
        },

        content: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft"
        },

        featured: {
            type: Boolean,
            default: false
        },

        tags: {
            type: [String],
            default: []
        },

        readingTime: {
            type: Number,
            default: 5
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Article", articleSchema);
