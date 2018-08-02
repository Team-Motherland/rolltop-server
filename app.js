require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

//File Upload 
var upload = require('express-fileupload');
const session      = require('express-session');
const passport     = require('passport');
const cors         = require('cors');

const passportSetup = require('./config/passport');
passportSetup(passport);


mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/testspace', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to Mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//File Upload
app.use(upload());

// Express View engine setup
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      
app.use(session({
  secret: 'team motherland auth passport secret shh',
  resave: true,
  saveUninitialized: true,
  cookie : { httpOnly: true, maxAge: 2419200000 }
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(passport.initialize());
app.use(passport.session());

// default value for title local
app.locals.title = 'Rolltop - Your All Access Online Desk';


const index = require('./routes/index');
app.use('/', index);


const nRoutes = require('./routes/api/noteRoutes');
app.use('/api', nRoutes);

const uRoutes = require('./routes/api/PasteRoutes');
app.use('/paste', uRoutes);

app.all('/*', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});


const placeRoutes = require('./routes/place-routes');
app.use('/api', placeRoutes);

const projectRoutes = require('./routes/project-routes');
app.use('/api', projectRoutes);

const authRoutes = require('./routes/auth-routes');
app.use('/api', authRoutes);

app.all('/*', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});



module.exports = app;
