var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var passport = require('passport');
var authenticate = require('./authenticate');
//var pixel = require('./image_pixels');
global.__basedir = __dirname;
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var contentRouter = require('./routes/content_router');
var uploadRouter = require('./routes/upload_router');
var adminRouter = require('./routes/admin');

const url=config.mongoURL;
const connect = mongoose.connect(url);

connect.then((db)=>{
  console.log('Connected to the MongoDB server');
},(err)=>{console.log(err);});


var app = express();

var session = require('express-session');
var FileStore = require('session-file-store')(session);

app.use(passport.initialize());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(require("body-parser").json())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/mycontent',contentRouter);
app.use('/upload',uploadRouter);
app.use('/admin',adminRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
