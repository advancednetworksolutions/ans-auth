// ==========================
// Import Needed Packages ===
// ==========================
var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
var rsaValidation = require('auth0-api-jwt-rsa-validation');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var User = require("./app/models/user");
var ADirectory = require('activedirectory');
var config = require('./config/config');


// =================
// Configuration ===
// =================
var port = process.env.PORT || 8080;
app.set('superSecret', config.secret);
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
//AD connection config
var adConfig = {
  url: config.ldap.url,
  baseDN: config.ldap.baseDN
};
//New AD connection object
var ad = new ADirectory(adConfig);

// =============
// Routes ======
// =============

// get an instance of the router for api routes
var apiRoutes = express.Router();

// Authentication route
apiRoutes.post('/authenticate', function(req, res) {
  ad.authenticate(req.body.username, req.body.password, function(err, auth) {
    if (err) {
      res.status(401).json({
        success:false,
        message: 'Authentication failed'
      });
      console.log('ERROR: ' + JSON.stringify(err));
      return;
    }
    if (auth) {
      var shortUsername = req.body.username.slice(0, req.body.username.indexOf("@"));
      var token = jwt.sign(shortUsername, app.get('superSecret'), {
      });
      res.status(200).json({
        success: true,
        username: shortUsername,
        email: req.body.username,
        token: token
      });
    } else {
      res.status(401).json({
        success:false,
        message: 'Authentication failed'
      });
    }
  });
});

// ====================
// Middleware =========
// ====================

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});

//Home route
apiRoutes.get('/', function(req, res) {
  res.json({
    success:true,
    message: "Welcome to the ANS LDAP authentication service"
  });
});
app.use('/', apiRoutes);
// =====================
// Start the server ====
// =====================
app.listen(port);
console.log('Rockin and rollin at http://localhost:'+port);
