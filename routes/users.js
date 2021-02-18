var express = require('express');
var router = express.Router();
var passport = require('passport');
const bodyParser = require('body-parser');
var User = require('../models/user_model');
var authenticate = require('../authenticate');
var cors = require('cors');

router.use(bodyParser.json());

/* GET users listing. */
router.options('*', cors.corsWithOptions, (req, res ) => {res.sendStatus(200);}); //so that a post request is sent from someone
router.post('/test',cors(), function(req, res, next) {
  console.log(req.body)
  //console.log(req.body.password)
  console.log("Success")

  res.json({"MODE":"Success"})
});

router.post('/signup',cors() ,(req, res, next) => {
  User.register(new User({username: req.body.username, firstname: req.body.firstname,lastname: req.body.lastname,email: req.body.email}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if(req.body.firstname)
        user.firstname = req.body.firstname;
      if(req.body.lastname)
        user.lastname = req.body.lastname;
      if(req.body.email)
        user.email=req.body.email;
      user.save((err, user)=>{
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});          
        }
        else{
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Registration Successful!'});
          });    
        }
      })
      
    }
  });
});

router.post('/login',cors() ,passport.authenticate('local'), (req, res) => {
  console.log(req.body.username);
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!', username: req.body.username});
});


router.get('/logout',cors(), (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;

