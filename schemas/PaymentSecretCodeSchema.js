//for payment verification code

const mongoose=require('mongoose');

const PaymentSecretCodeSchema=new mongoose.Schema({

    secretID:{
        type:Number,
        required:true
    },


});
module.exports=mongoose.model('SecretCodes',PaymentSecretCodeSchema,'PaymentSecret');