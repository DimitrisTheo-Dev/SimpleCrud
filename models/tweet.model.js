const mongoose = require('mongoose');
const TweetSchema = mongoose.Schema({
    title: String,
    content: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Tweet', TweetSchema);