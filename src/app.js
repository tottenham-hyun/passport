const express = require('express');
const cookieSession = require('cookie-session');
const path = require('path');
const config = require('config')
const passport = require('passport')
const { default: mongoose } = require('mongoose');
const flash = require('connect-flash')
const methodOverride = require('method-override')
const serverConfig = config.get('server');

require('./config/passport');
require('dotenv').config();

const app = express();

const mainRouter = require('./routes/main.router.js');
const usersRouter = require('./routes/users.router.js');
const postsRouter = require('./routes/posts.router.js');
const commentsRouter = require('./routes/comments.router.js');
const profileRouter = require('./routes/profile.router.js');
const likeRouter = require('./routes/likes.router.js');
const friendsRouter = require('./routes/friends.router.js');



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

app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash())
app.use((req,res,next)=>{
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    res.locals.currentUser = req.user;
    next()
})

app.use('/', mainRouter);
app.use('/auth', usersRouter);
app.use('/posts', postsRouter);
app.use('/posts/:id/comments', commentsRouter);
app.use('/profile/:id', profileRouter)
app.use('/friends', friendsRouter)
app.use(likeRouter)

app.get('/send', (req,res)=>{
    req.flash('post success', '포스트가 생성되었습니다.')
    res.send('message send page')
})

app.get('/receive', (req,res)=>{
    res.send(req.flash('post success'))
})
app.use((err,req,res,next)=>{
    res.status(err.status || 500)
    res.send(err.message || "Error Occurred")
})

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