var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose= require('mongoose');
const core = require('cors');

var app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

 

const productRoute = require('./routes/Product');
app.use(core());
app.use('/product',productRoute);


var storeManagerRoute =require('./routes/StoreManager');
app.use('/storeManager',storeManagerRoute);
const productCategory=require('./routes/ProductCategory');
app.use('/productCategory',productCategory);

//==================Cart===============================
const cartRouter=require('./routes/Cart');
app.use('/cart',cartRouter);


//==================USER================================
const userRoute=require('./routes/User')
const loginRoute=require('./routes/Login')
app.use('/user',userRoute);
app.use('/login',loginRoute);



//===============PAYMENT==================================
const paymentRoute = require('./routes/Payment');
app.use('/payment',paymentRoute);
//===============ORDER====================================
const orderRoute=require('./routes/Order');
app.use('/order',orderRoute);


/*************************************************************************************************************************/
app.use(express.static('public'));
app.use('/uploads',express.static('./uploads'));
/*************************************************************************************************************************/


//*********************************************Connect to Db**************************************************************
var uri = process.env.DB_URL;
mongoose.connect(uri, {useNewUrlParser: true});
const mydb = mongoose.connection;
mydb.on('error', error => console.log(error));
mydb.once('open', () => {
  console.log("Db connected");
});

//************************************************************************************************************************





module.exports = app;
