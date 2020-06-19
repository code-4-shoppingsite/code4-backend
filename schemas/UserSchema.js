//User schema by V.D Dantanarayana
const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({

    Fullname:{
        type:String,
        required:true

    },
    Username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true

    },type:{
        type:String,
        required:true

    },
    newPassword:{
        type:String,
    },
    mobile:{
        type:String,
    },
    nic:{
        type:String,
    },
    address1:{
        type:String,
    },
    address2:{
        type:String,
    },
    city:{
        type:String,
        

    },   token:{
        type:String,
        

    }, isdeleted:{
        type:String,
        required:true
        

    }, 

});
module.exports=mongoose.model('Users',UserSchema,'User')