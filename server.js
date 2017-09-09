var express = require('express');
var app = express();

// Set the port of our application.
// process.env.PORT lets the port be set by Heroku.
var port = process.env.PORT || 8080;

// Set the view engine to ejs.
app.set('view engine', 'ejs');

// Make express look in the public directory for assets (css/js/img).
app.use(express.static(__dirname + '/public'));

// Set the home page route.
app.get('/', function(req, res) {
  // ejs render automatically looks in the views folder.
  res.render('index');
});

app.listen(port, function() {
  console.log('App is running on http://localhost:' + port);
});

