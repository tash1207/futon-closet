const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const MongoClient = mongodb.MongoClient;

// Mongo variables
let db;
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/futoncloset';

// Set the port of our application.
// process.env.PORT lets the port be set by Heroku.
const port = process.env.PORT || 8080;

// Set the view engine to ejs.
app.set('view engine', 'ejs');

// Make express look in the public directory for assets (css/js/img).
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(url, (err, database) => {
  if (err) {
    console.log('Unabled to connect to mongoDB. Error:', err);
  } else {
    console.log('Connection established to', url);

    db = database;

    // Only listen if the db is connected.
    app.listen(port, () => {
      console.log('App is running on http://localhost:' + port);
    });
  }
});

// Set the home page route.
app.get('/', (req, res) => {
  // Get the info from the database.
  const col = db.collection('reviews');
  col.find().toArray((err, reviews) => {
    const recentReviews = reviews.reverse();
    // ejs render automatically looks in the views folder.
    res.render('index', {reviews: recentReviews.slice(0, 7)});
  });
});

app.post('/addReview', (req, res) => {
  const reviewText = req.body.reviewText.substring(0, 300);
  const col = db.collection('reviews');
  col.insertOne({'text': reviewText});
  res.redirect('/');
});
