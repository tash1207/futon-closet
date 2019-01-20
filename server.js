const Request = require('request');
const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const MongoClient = mongodb.MongoClient;

// Mongo variables
let db;
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/futoncloset';

// Captcha variables
const recaptchaSecret = '6Ld-JosUAAAAAD-hGsfZdvR7G5xj5UptXNFGOHe9';
const recaptchaUrl = 'https://www.google.com/recaptcha/api/siteverify';

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
  const reviewSubmitted = req.query.reviewSubmitted;
  // Get the info from the database.
  const col = db.collection('reviews');
  col.find().toArray((err, reviews) => {
    const recentReviews = reviews.reverse();
    // ejs render automatically looks in the views folder.
    res.render('index', {
      reviews: recentReviews.slice(0, 7),
      reviewSubmitted: reviewSubmitted,
    });
  });
});

// Page shown after user attempts to book a reservation.
app.get('/bookingStatus', (req, res) => {
  const reservationSuccess = req.query.reservationSuccess;
  const reservationOverlap = req.query.reservationOverlap;
  // ejs render automatically looks in the views folder.
  res.render('bookingstatus', {
    reservationSuccess: reservationSuccess,
    reservationOverlap: reservationOverlap
  });
});

// Page shown after user fails a captcha.
app.get('/badRobot', (req, res) => {
  // ejs render automatically looks in the views folder.
  res.render('badrobot');
});

app.post('/addReview', (req, res) => {
  const reviewAuthor = req.body['reviewAuthor'].substring(0, 30);
  const reviewText = req.body['reviewText'].substring(0, 300);
  const recaptchaResponse = req.body['g-recaptcha-response'];
  if (recaptchaResponse) {
    let recaptchaFullUrl = recaptchaUrl;
    recaptchaFullUrl += '?secret=' + recaptchaSecret;
    recaptchaFullUrl += '&response=' + recaptchaResponse;
    recaptchaFullUrl += '&remoteip=' + req.connection.remoteAddress;
    Request(recaptchaFullUrl, (error, resp, body) => {
      body = JSON.parse(body);
        if (!body.success) {
            res.redirect('/badRobot');
        } else {
          const col = db.collection('reviews');
          col.insertOne({'author': reviewAuthor, 'text': reviewText});
          res.redirect('/?reviewSubmitted=true');
        }
    });
  } else {
    res.redirect('/badRobot');
  }
});

app.post('/bookReservation', (req, res) => {
  const robotCode = req.body.robotCode;
  if (robotCode != '12345') {
    res.redirect('/badRobot');
  } else {
    const name = req.body.reservationName.substring(0, 50);
    const email = req.body.reservationEmail.substring(0, 50);
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const col = db.collection('reservations');

    const overlappingCriteria = {
      'confirmed': true,
      'startDate' : {$lte : endDate},
      'endDate' : {$gte : startDate}
    };
    col.find(overlappingCriteria).toArray((err, overlappingReservations) => {
      if (overlappingReservations.length > 0) {
        res.redirect('/bookingStatus?reservationOverlap=true');
        return;
      }
      // We did not find an overlapping reservation.
      try {
        col.insertOne({
          'startDate': startDate,
          'endDate': endDate,
          'name': name,
          'email': email,
          'confirmed': false
        });
        res.redirect('/bookingStatus?reservationSuccess=true');
      } catch (e) {
        res.redirect('/bookingStatus');
      }
    });
  }
});
