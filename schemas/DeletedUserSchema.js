//Delete user schema by V.D Dantanarayana
const mongoose=require('mongoose');

const DeletedUserSchema=new mongoose.Schema({

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
        

    }, isdeleted:{
        type:String,
        required:true
        

    }, reason:{

        type:String,

    }

});
module.exports=mongoose.model('DelUsers',DeletedUserSchema,'DelUser')