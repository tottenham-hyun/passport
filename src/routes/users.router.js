const User = require('../models/users.model');
const passport = require('passport')
const express = require('express');
const sendMail = require('../mail/mail');
const usersRouter = express.Router();

usersRouter.post('/login', (req,res,next)=>{
    passport.authenticate('local', (err,user,info)=>{
        if(err){
            return next(err)
        }
        if(!user) {
            return res.json({msg : info});
        }

        req.logIn(user, function(err){
            if(err) {
                return next(err);
            }
            res.redirect('/posts');
        })
    })(req,res,next)
})

usersRouter.post('/logout', (req,res,next)=>{
    req.logOut(function(err){
        if(err) return next(err)
        res.redirect('/login')
    })
})

usersRouter.post('/signup', async (req,res)=>{
    // user 객체를 생성합니다.
    const user = new User(req.body);

    try{
        // user collection에 저장합니다.
        await user.save();

        // 이메일 보내기
        sendMail('hwk3988@gmail.com', 'hyuns', 'welcome')
        res.redirect('/login');
    }catch(err){
        console.log(err)
    }
})

usersRouter.get('/google', passport.authenticate('google'));

usersRouter.get('/google/callback', passport.authenticate('google', {
    successReturnToOrRedirect : '/posts',
    failureRedirect : '/login'
}))

usersRouter.get('/kakao', passport.authenticate('kakao'));

usersRouter.get('/kakao/callback', passport.authenticate('kakao' , {
    successReturnToOrRedirect : '/posts',
    failureRedirect : '/login'
}))

module.exports = usersRouter;