module.exports = (app) => {
    const tweets = require('../controllers/tweet.controller.js');

    // Create a new Posts
    app.post('/tweets', tweets.create);

    // Retrieve all Posts
    app.get('/tweets', tweets.findAll);

    // Retrieve a single Tweet with tweetId
    app.get('/tweets/:tweetId', tweets.findOne);

    // Update a Tweet with tweetId
    app.put('/tweets/:tweetId', tweets.update);

    // Delete a Tweet with tweetId
    app.delete('/tweets/:tweetId', tweets.delete);
}