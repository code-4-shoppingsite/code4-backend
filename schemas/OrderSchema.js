const mongoose= require('mongoose');
// Student id :IT18045840
//Name :S.D.S.L Dissanayake
const OrderSchema = new mongoose.Schema({
    totalAmaount:{
        type:String,
        required:true
    },
    user_id:{
        type: String,
        required: true
    },
    products:{
        type: Array,
        required: true
    },
    numberOfItem:{
        type: String,
        required: true
        
    },
    orderCreateDate:{
        type:String,
        required:false
    },
    isDelevery :{
        type:Boolean,
        required:false
    }
    
   



});
module.exports =mongoose.model('Orders',OrderSchema,'Order');