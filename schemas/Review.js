const mongoose= require('mongoose');

const Review = new mongoose.Schema({
    pid:{
        type:String,
        required:true
    },
    uid:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    review:{
        type: String,
        required: true
    },
    rating:{
    type: Number,
        required: true
    },
    addDate:{
        type: Date,
        required: true
    },
    isblock:{
        type:Boolean,
        default:false,
        required:true
    }


});
module.exports =mongoose.model('Reviews',Review,'reviews');