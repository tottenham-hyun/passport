const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    description : String,
    // Comment 스키마를 참조하겠다
    comments : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment"
    }],
    // User 스키마를 참조하겠다
    author : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username : String
    },
    image : {
        type : String
    },
    likes : [{type: String}]
}, {timestamps : true})

module.exports = mongoose.model('Post', postSchema)