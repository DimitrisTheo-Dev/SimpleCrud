const Tweet = require('../models/tweet.model.js');
// Create and Save a new Tweet
exports.create = (req, res) => {
    // Validate the request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Tweet content can not be empty"
        });
    }

    // Create a new tweet
    const tweet = new Tweet({
        title: req.body.title || "Untitled Tweet",
        content: req.body.content
    });

    //Save the note in the database
    tweet.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "It seems that there is an error!"
            });
    });

};

// Retrieve and return all Tweet from the database.
exports.findAll = (req, res) => {
    Tweet.find()
        .then(tweets => {
            res.send(tweets);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Error! I could not retrieve the notes."
            });

    });

};

// Find a single Tweet with a unique TweetId
exports.findOne = (req, res) => {
    Tweet.findById(req.params.tweetId)
        .then(tweet => {
            if(!tweet) {
                return res.status(404).send({
                    message: "Tweet not found " + req.params.tweetId
                });
            }
            res.send(tweet);
        }).catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message:  "Tweet not found " + req.params.tweetId
                })
            }
            return res.status(500).send({
                message: "Error retrieving tweet with id " + req.params.tweetId
            });
    });
};

// Update a Tweet identified by the TweetId in the request
exports.update = (req, res) => {
    //Validate the request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Tweet can not be empty"
        });
    }
    // Find tweet and update it with the request body
    Tweet.findByIdAndUpdate(req.params.tweetId, {
        title: req.body.title || "Untitled Tweet",
        content: req.body.content
    }, {new: true})
        .then(tweet => {
            if(!tweet){
                return res.status(404).send({
                    message: "Tweet could not be found with id " + req.params.tweetId
                });
            }
            res.send(tweet);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Tweet not found by id " + req.params.tweetId
                });
            }
            return res.status(500).send({
                message: "Error updating the tweet with id " + req.params.tweetId
            });
    });
};

// Delete a Tweet with the specified TweetId in the request
exports.delete = (req, res) => {
    Tweet.findByIdAndRemove(req.params.tweetId)
        .then(tweet => {
            if(!tweet) {
                return res.status(404).send({
                    message: "Could not find tweet with the id " + req.params.tweetId

                });
            }
            res.send({message: "Tweet Deleted"});

        }).catch(err => {
            if(err.kind === "ObjectId" || err.name === 'NotFound'){
                return res.status(404).send({
                    message: "Could not find tweet with the id " + req.params.tweetId
                });
            }
            return res.status(500).send({
                message: "Could not delete tweet with the id " + req.params.body
            });
    });

};