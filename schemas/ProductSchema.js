const mongoose= require('mongoose');

const ProductSchema = new mongoose.Schema({
    proName:{
        type:String,
        required:true
    },
    catogory:{
        type: String,
        required: true
    },
    subCatogory:{
        type: String,
        required: true
    },
    size:{
        type: Array,
        required: true
    },
    brand:{
        type: String,
        required: true
    },
    quantity:{
        type:Number,
        required:true
    },
    condition:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    price:{
        type:Number,
        required:true
    },
    shipping: {
        type:Number
    },
    discount:{
        type:Number
    },
    sellerID:{
        type:String,
        required:true
    },
    id:{
        type:String,
        required:true
    },
    addDate:{
        type:Date,
        required:true
    },
    images:{
        type:Array,
        required:true
    },
    totClicks:{
        type:Number,
        required:false
    }



});
module.exports =mongoose.model('Products',ProductSchema,'product');