var express = require('express');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');

var app = express();
var MongoClient = mongodb.MongoClient;

// Mongo variables
var db;
var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/futoncloset';

// Set the port of our application.
// process.env.PORT lets the port be set by Heroku.
var port = process.env.PORT || 8080;

// Set the view engine to ejs.
app.set('view engine', 'ejs');

// Make express look in the public directory for assets (css/js/img).
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(url, function (err, database) {
  if (err) {
    console.log('Unabled to connect to mongoDB. Error:', err);
  } else {
    console.log('Connection established to', url);

    db = database;

    // Only listen if the db is connected.
    app.listen(port, function() {
      console.log('App is running on http://localhost:' + port);
    });
  }
});

// Set the home page route.
app.get('/', function(req, res) {
  // Get the info from the database.
  var col = db.collection('reviews');
  col.find().toArray(function(err, reviews) {
    // ejs render automatically looks in the views folder.
    res.render('index', {reviews: reviews});
  });
});

app.post('/addReview', function(req, res) {
  var reviewText = req.body.reviewText.substring(0, 300);
  var col = db.collection('reviews');
  col.insertOne({'text': reviewText});
  res.redirect('/');
});
