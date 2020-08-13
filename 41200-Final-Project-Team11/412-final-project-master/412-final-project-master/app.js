require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressMongoDb = require('express-mongo-db');
const mongoDB = require('./services/mongodb');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const mongo = require('./services/mongodb');
const {PubSub} = require('@google-cloud/pubsub');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');
const cartRouter = require('./routes/cart');
const paymentRouter = require('./routes/payment');
// const emailRouter = require('./routes/email');

const app = express();

async function startDB(){
    await mongoDB.init();
}

startDB();
app.use(session({
  store: new MongoStore({
    url: process.env.MONGO_CONNECTION_STRING
  }),
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 7 * 2} // 2 weeks
}));


app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressMongoDb(process.env.MONGO_CONNECTION_STRING));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);
app.use('/cart', cartRouter);
app.use('/payment', paymentRouter);
// app.use('/email', emailRouter);

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
