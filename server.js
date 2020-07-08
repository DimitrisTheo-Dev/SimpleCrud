var express = require('express'),
    app = express(),
    mongoose = require("mongoose"),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    User = require("./models/users"),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose')


mongoose.connect("mongodb://localhost/api");
//Πειραζει an στο require express balw var  και στο app.use balw const?
app.set('view engine', 'ejs');
const dbConfig = require('./config/database.config.js');


// Not sure if necessary
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse requests of content-type - application/json
app.use(bodyParser.json())
app.use(require("express-session")({
    // to decode the session
    secret: "Result code",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
//encode
passport.serializeUser(User.serializeUser());
//decode
passport.deserializeUser(User.deserializeUser());


// Promise is for asyncronous?
mongoose.Promise = global.Promise;

// Connect to db
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Succesful connection to the db");

}).catch(err => {
    console.log("Could not connect to db. Exiting...", err);
    process.exit();
});



app.get("/", function(req, res){
    res.render("home");
});


app.get("/results", isLoggedIn, function(req, res){
    res.render("results");
});

app.get("/register", function (req, res){
    res.render("register");
});


//Auth Routes
//Show sign up form
app.post("/register", function (req, res) {
    req.body.username
    req.body.password
    //Do not save passwords to the database
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("/register");
        }
        // i could use instead of local github to sign up with github but more work is required
        passport.authenticate("local")(req, res, function(){
            res.redirect("/results");

        });

    });
});

//Login Routes
//Render Login Form
app.get("/login", function(req, res){
    res.render("login");
});

//Login logic
//middleware is the code that runs before our final route callback
app.post("/login", passport.authenticate("local", {
    successRedirect: "/results",
    failureRedirect: "/login"
}),function(req,res){

});
app.get("/logout", function (req, res){
    req.logout();
    res.redirect("/");

});

//middleware for security purpose
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//Require Tweets route
require('./routes/tweet.routes.js')(app);
app.listen(5000, () => {
    console.log("Listening on 5000");
});

// app.listen(process.env.PORT, process.env.IP ,function(){
//     console.log("Its running");
// })