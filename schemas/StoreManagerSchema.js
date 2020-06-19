const mongoose= require('mongoose');
// Student id :IT18045840
//Name :S.D.S.L Dissanayake
const StoreManagerSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    emailAddress:{
        type: String,
        required: true
        
    },
    birthDay:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    telephoneNumber:{
        type:String,
        required:true
    },

    userTableId:{
        type:String,
        required:false
    }
   



});
module.exports =mongoose.model('StoreManagers',StoreManagerSchema,'StoreManager');