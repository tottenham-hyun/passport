const { checkAuthenticated, checkNotAuthenticated } = require("../middleware/auth");
const express = require('express')
const mainRouter = express.Router();

mainRouter.get('/', checkAuthenticated, (req,res) => {
    res.render('index')
})

mainRouter.get('/login', checkNotAuthenticated, (req,res)=>{
    res.render('auth/login');
})

mainRouter.get('/signup', checkNotAuthenticated, (req,res)=>{
    res.render('auth/signup');
})

module.exports = mainRouter;