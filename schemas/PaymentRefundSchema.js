//for refunded payments

const mongoose=require('mongoose');

const PaymentRefundSchema=new mongoose.Schema({

    payID:{
        type:String,
        required:true
    },
    userID:{
        type:String,
        required:true
    },
    orderID:{
        type:String,
        required:true
    },
    payAmount:{
        type:String,
        required:true
    },
    payDate:{
        type:String,
        required:true
    },
    payType:{
        type:String,
        required:true
    },
    payReceipt:{
        type:Boolean,
        required:true
    },
    paymentStatus:{
        type:String,
        required:true
    },
    refundRequest:{
        type:Boolean,
        required:true
    },
    cardNumber:{
        type:Number
    },
    cardCSV:{
        type:Number
    },
    cardType:{
        type:String
    },
    cardHolderName:{
        type:String
    },
    cardExpireDate:{
        type:String
    },
    bankName:{
        type:String
    },
    bankBranch:{
        type:String
    },
    depositedAmount:{
        type:Number
    },
    depositedDate:{
        type:String
    },
    receiptNumber:{
        type:String
    },

});
module.exports=mongoose.model('Refunds',PaymentRefundSchema,'PayRefunds');