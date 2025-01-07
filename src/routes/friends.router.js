const express = require('express')
const { checkAuthenticated } = require('../middleware/auth')
const User = require('../models/users.model')
const router = express.Router()

router.get('/', checkAuthenticated, (req,res)=>{
    User.find({})
        .then((users)=>{
            res.render('friends', {
                users : users,
                currentUser : req.user
            })
        })
        .catch(()=>{
            req.flash('error', '유저를 가져오는데 에러가 발생했습니다')
            res.redirect('/posts')
        })
})

router.put('/:id/add-friend', checkAuthenticated, (req,res)=>{
    User.findById(req.params.id)
    .then((user)=>{
            User.findByIdAndUpdate(user._id, {friendsRequest : user.friendsRequest.concat([req.user._id])})
            .then(()=>{
                req.flash('success', '친구 추가 성공했습니다.')
            })
            .catch(()=>{
                req.flash('error', '유저를 가져오는데 에러가 발생했습니다')
            })
        })
        .catch(()=>{
            req.flash('error', '유저를 가져오는데 에러가 발생했습니다')
        })
    res.redirect('back')
})

router.put('/:firstId/remove-friend-request/:secondId', checkAuthenticated, (req,res) => {
    User.findById(req.params.firstId)
        .then((user)=>{
            const filteredFriendsRequest = user.friendsRequest.filter(friendId => friendId !== req.params.secondId)
            User.findByIdAndUpdate(user._id, {
                friendsRequest : filteredFriendsRequest
            })
            .then(()=>{
                req.flash('success', '친구 요청 취소를 성공했습니다.')
                res.redirect('back')
            })
            .catch(()=>{
                req.flash('error', '친구 요청 취소를 하는데 에러가 났습니다.')
                res.redirect('back')
            })
        })
        .catch(()=>{
            req.flash('error', '유저를 찾지 못했습니다.')
            res.redirect('back')
        })
})

router.put('/:id/accept-friend-request', checkAuthenticated, (req, res) => {
    User.findById(req.params.id)
        .then((sendUser)=>{
            User.findByIdAndUpdate(sendUser._id, {
                friends : sendUser.friends.concat([req.user._id])
            })
            .then(()=>{
                User.findByIdAndUpdate(req.user._id, {
                    friends : req.user.friends.concat([sendUser._id]),
                    friendsRequest : req.user.friendsRequest.filter(friendId => friendId !== sendUser._id.toString())
                })
                .then(()=>{
                    req.flash('success', '친구 추가를 성공했습니다')
                    res.redirect('back')
                })
                .catch(()=>{
                    req.flash('error', '친구 추가하는데 실패했습니다')
                    res.redirect('back')
                })
            })
            .catch(()=>{
                req.flash('error', '친구 추가하는데 실패했습니다.')
                res.redirect('back')
            })
        })
        .catch(()=>{
            req.flash('error', '유저를 찾지 못했습니다')
            res.redirect('back')
        })
})

router.put('/:id/remove-friend', checkAuthenticated, (req,res)=>{
    User.findById(req.params.id)
        .then((user)=>{
            User.findByIdAndUpdate(user._id, {
                friends : user.friends.filter(friendId => friendId !== req.user._id.toString())
            })
            .then(()=>{
                User.findByIdAndUpdate(req.user._id, {
                    friends : req.user.friends.filter(friendId => friendId !== req.params.id.toString())
                })
                .then(()=>{
                    req.flash('success', '친구 삭제하는데 성공했습니다')
                    res.redirect('back')
                })
                .catch(()=>{
                    req.flash('error', '친구 삭제하는데 실패했습니다')
                    res.redirect('back')
                })
            })
            .catch(()=>{
                req.flash('error', '친구 삭제하는데 실패했습니다.')
                res.redirect('back')
            })
        })
        .catch(()=>{
            req.flash('error', '유저를 찾는데 실패했습니다')
            res.redirect('back')
        })
})


module.exports = router