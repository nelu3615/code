var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var express = require('express');
const passport = require('passport');
const methodOverride = require('method-override');
//Flash Messages for errors etc
const flash = require('connect-flash');
const session = require('express-session');   

// Load Keys for DB
const keys = require('./config/keys');
//connect to db
mongoose.connect(keys.mongoURI, {useNewUrlParser:true})
.then(()=>console.log('connectd to db'))
.catch((err)=>console.log('error ',err));

//init app
var app = express();

//set view engine
app.set('view engine','ejs');

/////LOAD ROUTES////////
const users = require('./routes/users');
const index = require('./routes/index');

//PAssport Config for LOGIN
require('./config/passport')(passport);


///fetch the data from request
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); 



//method override middleware
app.use(methodOverride('_method'));

//Express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Middleware for messages
app.use(flash());

//GLobal variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
       //will be here only if user logged in
  res.locals.user = req.user || null; 
  next();
});

//USE ROUTES
//default page load
app.use('/', index);
app.use('/users', users); 

var port = process.env.PORT || 3000;
app.listen(port,()=>console.log('server run at '+port));