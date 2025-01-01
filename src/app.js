const express = require('express');
const cookieSession = require('cookie-session');
const path = require('path');
const config = require('config')
const passport = require('passport')
const { default: mongoose } = require('mongoose');
const serverConfig = config.get('server');
const mainRouter = require('./routes/main.router.js');
const usersRouter = require('./routes/users.router.js');

require('./config/passport');
require('dotenv').config();

const app = express();

app.use(cookieSession({
    keys : [process.env.COOKIE_ENCRYPTION_KEY]
}))
// register regenerate & save after the cookieSession middleware initialization
app.use(function(request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb()
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => {
            cb()
        }
    }
    next()
})

app.use(express.json());
app.use(express.urlencoded({extended : false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', mainRouter);
app.use('/auth', usersRouter);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('연결완료');
    })
    .catch((err)=>{
        console.log(err);
    });

app.listen(serverConfig.port, ()=>{
    console.log('서버 시작');
})