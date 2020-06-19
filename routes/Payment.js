//payment controller - by Gomez K. J - IT18038606
const express = require('express');
const router = express.Router();
const uniqid = require('uniqid');
const bodyParser =require('body-parser');
const core = require('cors');
const PaymentSchema=require('../schemas/PaymentSchema');
const SecretCode=require('../schemas/PaymentSecretCodeSchema');
const RefundPayment=require('../schemas/PaymentRefundSchema');
const OrderSchema=require('../schemas/OrderSchema');
const UserSchema = require('../schemas/UserSchema');
const nodemailer = require('nodemailer');

//for API authentication
const authenticateToken = require('./authenticateToken');


router.use(bodyParser());
router.use(core());
var payUID;
var rn = require('random-number');



//to store card payments and send verifications code
router.post('/addCardPayment', authenticateToken, async function(req,res){

    try {
        let gotData = req.body.orderID;
        let query = {_id: gotData};
        let data = await OrderSchema.find(query);

        let dataOrder = [];

        data.forEach((details) => {
            dataOrder = ({
                userID : details.user_id,
                payAmount : details.totalAmaount
            })
        });

            payUID = uniqid();
            const payID = payUID;
            const userID = dataOrder.userID;
            const orderID = req.body.orderID;
            const payAmount = dataOrder.payAmount;
            const payDate = req.body.payDate;
            const payType = 'Card';
            const paymentStatus = 'Processing';
            const refundRequest = false;
            const cardNumber = req.body.cardNumber;
            const cardCSV = req.body.cardCSV;
            const cardHolderName = req.body.cardHolderName;
            const expireDate = req.body.expireDate;
            const cardType = req.body.cardType;
            const payReceipt = req.body.payReceipt;
            const receiptNumber = req.body.receiptNumber;


        const data1 =({
            payID: payID,
            userID: userID,
            orderID: orderID,
            payAmount: payAmount,
            payDate: payDate,
            payType: payType,
            paymentStatus: paymentStatus,
            refundRequest: refundRequest,
            payReceipt: payReceipt,
            cardNumber: cardNumber,
            cardCSV: cardCSV,
            cardType: cardType,
            cardHolderName: cardHolderName,
            cardExpireDate: expireDate,
            receiptNumber: receiptNumber
        });


        const NewPayment=new PaymentSchema(data1);

        await NewPayment.save(async function(err,payment) {
            if (err){
                console.log(err + "This is the error");
            }
            else
            {
                console.log(payment.payID + " added successfuly");
            }
        })

        let userID1 = dataOrder.userID;
        let query2 = {_id: userID1};
        let data2 = await UserSchema.find(query2);

        let fromUser = [];

        data2.forEach((details) => {
            fromUser = ({
                email: details.email
            })
        });

        var options = {
            min:  123456
            , max:  999999
            , integer: true
        };
        let code = rn(options);

        const storeData =({
            secretID: code
        });

        const NewSecret=new SecretCode(storeData);

        await NewSecret.save(async function(err,payment) {
            if (err){
                console.log(err + "This is the error");
            }
            else
            {
                console.log("Secret code added successfuly");
            }
        });

        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "c4fashions@gmail.com", // generated ethereal user
                pass: process.env.EMAILPASS, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"C4 Fashions" <c4fashions@gmail.com>', // sender address
            to: fromUser.email, // list of receivers
            subject: "Two step verification", // Subject line
            text:
                "Please find the below secret code:",
            html: '<h3>Your code is <h1>'+code+'</h1></h3>'

        });

    }catch (e) {
        
    }

});


//to store bank payment which is receipt payments and send verification code
router.post('/addBankPayment', authenticateToken, async function(req,res){
    try {

        let gotData = req.body.orderID;
        let query = {_id: gotData};
        let data = await OrderSchema.find(query);

        let dataOrder = [];

        data.forEach((details) => {
            dataOrder = ({
                userID : details.user_id,
                payAmount : details.totalAmaount
            })
        });

        payUID = uniqid();
        const payID = payUID;
        const userID = dataOrder.userID;
        const orderID = req.body.orderID;
        const payAmount = dataOrder.payAmount;
        const payDate = req.body.payDate;
        const payType = 'Bank';
        const paymentStatus = 'Processing';
        const refundRequest = false;
        const cardNumber = req.body.cardNumber;
        const cardCSV = req.body.cardCSV;
        const cardHolderName = req.body.cardHolderName;
        const expireDate = req.body.expireDate;
        const cardType = req.body.cardType;
        const payReceipt = req.body.payReceipt;
        const bankName = req.body.bankName;
        const bankBranch = req.body.bankBranch;
        const depositedAmount = req.body.depositedAmount;
        const depositedDate = req.body.depositedDate;
        const receiptNumber = req.body.receiptNumber;


        const data1 =({
            payID: payID,
            userID: userID,
            orderID: orderID,
            payAmount: payAmount,
            payDate: payDate,
            payType: payType,
            paymentStatus: paymentStatus,
            refundRequest: refundRequest,
            payReceipt: payReceipt,
            cardNumber: cardNumber,
            cardCSV: cardCSV,
            cardType: cardType,
            cardHolderName: cardHolderName,
            cardExpireDate: expireDate,
            bankName: bankName,
            bankBranch: bankBranch,
            depositedAmount: depositedAmount,
            depositedDate: depositedDate,
            receiptNumber:receiptNumber
        });


        const NewBankPayment=new PaymentSchema(data1);

        await NewBankPayment.save(async function(err,payment) {
            if (err){
                console.log(err + "This is the error");
            }
            else
            {
                console.log(payment.payID + " added successfuly");
            }
        })

        let userID1 = dataOrder.userID;
        let query2 = {_id: userID1};
        let data2 = await UserSchema.find(query2);

        let fromUser = [];

        data2.forEach((details) => {
            fromUser = ({
                email: details.email
            })
        });

        var options = {
            min:  123456
            , max:  999999
            , integer: true
        };
        let code = rn(options);

        const storeData =({
            secretID: code
        });

        const NewSecret=new SecretCode(storeData);

        await NewSecret.save(async function(err,payment) {
            if (err){
                console.log(err + "This is the error");
            }
            else
            {
                console.log("Secret code added successfuly");
            }
        });

        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "c4fashions@gmail.com", // generated ethereal user
                pass: process.env.EMAILPASS, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"C4 Fashions" <c4fashions@gmail.com>', // sender address
            to: fromUser.email, // list of receivers
            subject: "Two step verification", // Subject line
            text:
                "Please find the below secret code:",
            html: '<h3>Your code is <h1>'+code+'</h1></h3>'

        });

    }catch (e) {

    }

});


//once a refund request is raised, to change the refund request status as true
router.post('/refundRequest', authenticateToken, async function(req,res){

    try{
        const searchID = req.body.id;

        var updateRefundStatus = {
            refundRequest   : true
        };
        var query = {payID: searchID};
        var data=await PaymentSchema.find(query);
        var result =await PaymentSchema.updateOne({payID:searchID},updateRefundStatus);
        if(result.ok == 1){
            console.log("Status update is successful");
            res.send(data);
        }else{
            console.log("Eroor!!!! Status update is unsuccessful");
            res.status(404).send("parameter error");
        }

    }catch (e) {
        res.status(404).send("parameter error");
    }

});

//to check the verification code
router.get('/getSecretCode', authenticateToken, async function(req,res){
    try{
        var data=await SecretCode.findOne();
        res.send(data);
    }catch (e) {
        res.status(404).send("parameter error");
    }

});

//once the verification code is validated, remove from table
router.post('/removeSecretCode', async function(req,res){
    try{
        console.log("Came inside remove secret code");
        let dropall =await SecretCode.deleteOne();
    }catch (e) {
        res.status(404).send("parameter error");
    }

});

//get both card and bank payment details according to the user logged in
router.post('/getAllPaymentDetails', authenticateToken, async function(req,res){
    try{
        var gotData = req.body.userID;
        var data=await PaymentSchema.find({userID: gotData});
        res.send(data);
    }catch (e) {
        res.status(404).send("parameter error");
    }

});

//for payment admin, to view all the card payments of users
router.get('/getCardPaymentDetails',authenticateToken,async function(req,res){
    try{
        var query = {payType: 'Card'};
        var data=await PaymentSchema.find(query);
        res.send(data);
    }catch (e) {
        res.status(404).send("parameter error");
    }

});

//for payment admin, to view all the bank payments of users
router.get('/getBankPaymentDetails',authenticateToken,async function(req,res){
    try{
        var query = {payType: 'Bank'};
        var data=await PaymentSchema.find(query);
        res.send(data);
    }catch (e) {
        res.status(404).send("parameter error");
    }

});

//generating data for the payment invoice for a particular payment
router.post('/getDataForInvoice', authenticateToken, async function(req,res){
    try{
        let gotData = req.body.payID;
        let query = {payID: gotData};
        let data=await PaymentSchema.find(query);

        res.send(data);
    }catch (e) {
        res.status(404).send("parameter error");
    }

});

//for payment admin, to change the both card/bank payment status as accepted or else can keep it as processing
router.post('/changeCardStatus', authenticateToken, async function(req,res){
    try{
        const userID = req.body.id1;
        const gotID = req.body.id;
        let query1 = {_id: userID};
        let data1 = await UserSchema.find(query1);

        let fromUser = [];

        data1.forEach((details) => {
            fromUser = ({
                email: details.email
            })
        });

        var updatePaymentStatus = {
            paymentStatus :'Completed',
            refundRequest: false
        };
        var result =await PaymentSchema.updateOne({payID:gotID},updatePaymentStatus);

        let testAccount1 = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter1 = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "c4fashions@gmail.com", // generated ethereal user
                pass: process.env.EMAILPASS, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info1 = await transporter1.sendMail({
            from: '"C4 Fashions" <c4fashions@gmail.com>', // sender address
            to: fromUser.email, // list of receivers
            subject: "Payment completion", // Subject line
            text:
                "Your below payment is completed:",
            html: '<h4>Your payment: <h2>'+gotID+'</h2> has been completed</h4><br>'
                +
                '<a href="'+process.env.FROUNTENDURL+'/payInvoice?getInvoice='+gotID+'">Click to get the receipt</a>'

        });
    }catch (e) {
        res.status(404).send("parameter error");
        console.log(e);
    }

});

//get payment details to refund section for user
router.post('/getRefundPaymentDetails', authenticateToken, async function(req,res){
    try{
        var gotData = req.body.userID;
        var data=await PaymentSchema.find({payType: 'Card', userID: gotData});
        res.send(data);
    }catch (e) {
        res.status(404).send("parameter error");
    }

});

//for payment admin, get refund requests from users
router.get('/getRefundPaymentDetailsForAdmin', authenticateToken, async function(req,res){
    try{
        var query = {refundRequest: true, paymentStatus: 'Processing'};
        var data=await PaymentSchema.find(query);
        res.send(data);
    }catch (e) {
        res.status(404).send("parameter error");
    }

});

//for payment admin, to do actions on refund requests and send emails to user regarding their refund request
//and move refund accepted payments to refund table
router.post('/acceptRefund', authenticateToken, async function(req,res){
    try{
        const userID = req.body.id1;
        const gotID = req.body.id;
        let query1 = {_id: userID};
        let data1 = await UserSchema.find(query1);

        let fromUser = [];

        data1.forEach((details) => {
            fromUser = ({
                email: details.email
            })
        });

        var updatePaymentStatus = {
            paymentStatus :'Refunded'
        };
        var result =await PaymentSchema.updateOne({payID:gotID},updatePaymentStatus);

        var query = {payID: gotID};
        const data=await PaymentSchema.find(query);

        let addRefund = [];
        data.forEach((details) => {
            addRefund = ({
                payID: details.payID,
                userID: details.userID,
                orderID: details.orderID,
                payAmount: details.payAmount,
                payDate: details.payDate,
                payType: details.payType,
                paymentStatus: details.paymentStatus,
                refundRequest: details.refundRequest,
                payReceipt: details.payReceipt,
                cardNumber: details.cardNumber,
                cardCSV: details.cardCSV,
                cardType: details.cardType,
                cardHolderName: details.cardHolderName,
                cardExpireDate: details.cardExpireDate,
                bankName: null,
                bankBranch: null,
                depositedAmount: null,
                depositedDate:null,
                receiptNumber:null
            })

        });

        const newRefunded = new RefundPayment(addRefund);

        await newRefunded.save(async function(err,payment) {
            if (err){
                console.log(err + "This is the error");
            }
            else
            {
                console.log(payment.payID + " refund added successfuly");
            }
        })

        var removeRefund = await PaymentSchema.deleteOne(query);

        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "c4fashions@gmail.com", // generated ethereal user
                pass: process.env.EMAILPASS, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"C4 Fashions" <c4fashions@gmail.com>', // sender address
            to: fromUser.email, // list of receivers
            subject: "Refund request acceptance", // Subject line
            text:
                "Your below refund payment is completed:",
            html: '<h3>Your refund request: </h3><h2>'+gotID+'</h2><h3>has been completed</h3>'

        });
    }catch (e) {
        res.status(404).send("parameter error");
    }

});

//get order details
router.post('/getOrderDetails', authenticateToken, async function(req,res){
    try{

        let gotData = req.body.orderID;
        console.log(gotData);
        let query = {_id: gotData};
        let data=await OrderSchema.find(query);

        res.send(data);
    }catch (e) {
        res.status(404).send("parameter error");
    }

});

//to fix the issue with bank
router.post('/fixIssue', authenticateToken, async function(req,res){
    try{
        console.log("Came inside to API");
        let dropall =await SecretCode.remove();
    }catch (e) {
        res.status(404).send("parameter error");
    }

});


module.exports = router;