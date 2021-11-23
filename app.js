const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Joi = require('joi');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const ExpressError = require('./utils/ExpressError');

const userRoutes = require('./routes/user');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');


const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {})
    .then(() => {
        console.log('Mongo CONNECTION OPEN!!!!');
    }).catch(err => {
        console.log('Oh Noooo Mongo error');
        console.log(err);
    });


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        htttpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 60,
        maxAge: 1000 * 60 * 60 * 60
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/fakeUser', async (req, res) => {
    const user = new User({ email: 'colt@email.com', username: 'col3t' });
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/makecampground', async (req, res) => {
    const camp = new Campground({ title: 'My Backyard', description: 'Cheap camping' });
    await camp.save();
    res.send(camp);
});






app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, Something went wrong!!!'
    res.status(statusCode).render('error', { err });
})


/* Defining the port */
app.listen(3000, () => {
    console.log('Serving on port 3000');
});