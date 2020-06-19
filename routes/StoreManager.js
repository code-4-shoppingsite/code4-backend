const express = require('express');
const router =express.Router();
const authenticateToken = require('./authenticateToken');


const bodyParser =require('body-parser');
const core = require('cors');
const fs= require('fs');

router.use(bodyParser());
router.use(core());

const uniqid=require('uniqid');
const UserSchema=require('../schemas/UserSchema');
let StoreManager = require('../schemas/StoreManagerSchema');
const DeleteUserSchema=require('../schemas/DeletedUserSchema');
const crypto=require('crypto');
const nodemailer=require('nodemailer');

var UID;

// const express=require('express');
// const router=express.Router();
// const uniqid=require('uniqid');
// const bodyParser=require('body-parser');
// const core = require('cors');
// const UserSchema=require('../schemas/UserSchema');
// const DeleteUserSchema=require('../schemas/DeletedUserSchema');
// //const bycrpt=require('bcrypt');
// const crypto=require('crypto');
// const nodemailer=require('nodemailer');
// router.use(bodyParser());
// router.use(core());
// var UID;

// Student id :IT18045840
//Name :S.D.S.L Dissanayake

//Add Store manager as a youser
router.post('/addasUser',async function(req,res){

    try{
    
      var data=await  UserSchema.findOne({Username:req.body.Username});
      var data1=await  UserSchema.findOne({email:req.body.email});
     
      if(data1===null)
      {
    
        var newQuery=[];
        UID=uniqid();
    
        newQuery=req.body;
        newQuery['uid']=UID;
        newQuery['regDate']=new Date();
        newQuery['isdeleted']=false;
        newQuery['mobile']="",
        newQuery['nic']="",
        newQuery['address1']="",
        newQuery['address2']="",
        newQuery['city']="",    
       // token=await bycrpt.hash(UID+new Date(),10);
       
       token=await crypto.createHash('md5').update(UID+new Date()).digest('hex');
    
        const newUser=new UserSchema(newQuery);
        await newUser.save(async function(err,product){
    
            if (err) {
                console.error(err);
                res.status(500).send( "Eroor"+err);
            }else{
              res.send(product)
              try{
       
    console.log("befire")
                let testAccount = await nodemailer.createTestAccount();
    console.log("after")
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
                var email=await product.email;
                console.log(email)
               console.log("transport visited")
                // send mail with defined transport object
                let info = await transporter.sendMail({
                  from: '"C4fashions" <c4fashions@gmail.com>', // sender address
                  to: email, // list of receivers
                  subject: "complete user registration", // Subject line
                  text:
                  ""+process.env.FROUNTENDURL+"/RegisterConfirm?token="+token+"&user_id="+product._id+"", // plain text body
                  html: '<p>You are Register as a Store Manager Your User name is :<b>'+product.Username+'</b> 👍 </p> <a href="'+process.env.FROUNTENDURL+'/RegisterConfirm?token='+token+'&user_id='+product._id+'">to complete registration click hear</a>',
                 
              
                });
              
                console.log("Message sent: %s", info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
              
                // Preview only available when sending through an Ethereal account
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    
                // res.json({success:true});
            
              }catch(e)
              {
                console.log(e)
                res.json({success:false});
              }
            }
    
    
    
        });
      }else{
    
        res.json({success:false,err:"There is a user with this email or username"});
      }
    
    }catch(e)
    {
      console.log(e);
      res.send(e);
    }
    });




//Add new storemanager
// router.route('/add').post((req,res)=>{

router.post("/add",authenticateToken,async function(req,res){

    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const birthDay=req.body.birthDay;
    const password =req.body.password;
    const emailAddress=req.body.email;
    const address=req.body.address;
    const telephoneNumber=req.body.telephonenumber;
    const userTableId=req.body.userTableId

    const newStoreManager=new StoreManager({
        firstName,
        lastName,
        password,
        emailAddress,
        birthDay,
        address,
        telephoneNumber,
        userTableId
    });

    newStoreManager.save()
        .then(newStoremanager=>res.json('new store manager added'))
        .catch(err=>res.status(400).json('Error in Create new Store manager '+err));


});

//Delete Storemanager in User
router.post("/removeuser",async function(req,res){

console.log(req.body);

  let data = await UserSchema.find({_id:req.body.id});

  let addDelete = [];
  data.forEach((details) => {
    addDelete = ({
      uid: details._id,
        Fullname: details.Fullname,
        Username: details.Username,
        email: details.email,
        type: details.type,
        mobile: details.mobile,
        nic: details.nic,
        address1: details.address1,
        address2: details.address2,
        city: details.city,
        isdeleted: "true",
        reason: req.body.reason,
       
    })

});

const deleteUser=new DeleteUserSchema(addDelete);

await deleteUser.save(async function(err,deluser) {
  if (err){
      console.log(err + "Error adding");
  }
  else
  {
      console.log(deluser.Fullname + " User added successfully");
  }
})

var removeRefund = await UserSchema.deleteOne({_id:req.body.id});
if(removeRefund===null)
{
  res.json({success:false,status:400});
}else{
  res.json({success:true,status:200});
}

});





//Delete selected product
router.route('/:id').delete((req,res)=>{
    StoreManager.findByIdAndDelete(req.params.id)
        .then(storemanager=>res.json('storemanager delete'))
        .catch(err=>res.status(400).json('Error: '+err));
});

//get selected storemanager
router.route('/:id').get((req,res)=>{
    StoreManager.findById(req.params.id)
        .then(exercise=>res.json(exercise))
        .catch(err=>res.status(400).json('Error: '+err));
});
//Get all storemanager
router.get('/',authenticateToken,async function(req,res){
    StoreManager.find()
        .then(exercise=>res.json(exercise))
        .catch(err=>res.status(400).json('Error: '+err));
});


//update selected product storemanager

router.route('/update/:id').post((req,res)=>{

    let selected_id=req.params.id;

    let updatedfirstName=req.body.firstName;
    let updatedlastName=req.body.lastName;
    let updatedbirthDay=req.body.birthDay;
    let updatedpassword =req.body.password;
    let updatedemailAddress=req.body.email;
    let updatedaddress=req.body.address;
    let updatedtelephoneNumber=req.body.telephonenumber;
    console.log("recive_data: "+updatedfirstName+updatedlastName+updatedbirthDay+updatedpassword+updatedemailAddress+updatedaddress+updatedtelephoneNumber);
    
    StoreManager.findByIdAndUpdate(
         selected_id,
        { 
            
                "firstName": updatedfirstName,
                "lastName":updatedlastName,
                "emailAddress":updatedemailAddress,
                "birthDay":updatedbirthDay,
                "address":updatedaddress,
                "telephoneNumber":updatedtelephoneNumber
                
        
        },(err,storemanager)=>{
           
            res.send(storemanager);
           
        }
     )


    // const updatedStoreManager=new StoreManager({
    //     firstName,
    //     lastName,
    //     password,
    //     emailAddress,
    //     birthDay,
    //     address,
    //     telephoneNumber
    // });
      
    // StoreManager.findById(req.params.id)
    //             .then(()=>{
    //                 updatedStoreManager.save()
    //                 .then(updatedStoreManager=>res.json('new store manager added'))
    //                 .catch(err=>res.status(400).json('Error in Create new Store manager '+err));
    //             })

        // .then(storemanager=>{
        //     storemanager.firstName=req.body.firstName;
        //     storemanager.lastName=req.body.lastName;
        //     storemanager.birthDay=req.body.birthDay;
        //     storemanager.emailAddress=req.body.email;
        //     storemanager.address=req.body.address;
        //     storemanager.telephoneNumber=req.body.telephonenumber;
        //     storemanager.save()
        //         .then(success=>res.json('storemanager updated'))
        //         .catch(err=>res.status(400).json('Error: '+err));
        // })
        // .catch(err=>res.status(400).json('Error: '+err));

   


});


router.route('/updateuser').post(async (req,res)=>{
 
  getpriviousfrstname= await UserSchema.findById(req.body.id);

  if(!(req.body.Username==getpriviousfrstname.Username)){
   
    console.log("Youser name is chnage");

    console.log(req.body.Username);
    console.log(getpriviousfrstname.Username);

    let testAccount = await nodemailer.createTestAccount();
    console.log("after")
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
                var email=await getpriviousfrstname.email;
                console.log(email)
               console.log("transport visited")
                // send mail with defined transport object
                let info = await transporter.sendMail({
                    from: '"C4fashions" <c4fashions@gmail.com>', // sender address
                    to: email, // list of receivers
                   subject: "user name is update", // Subject line
                    text:
                    "User name is change ", // plain text body
                    html: '<p>Your User name is changed, New user name is :<b>'+req.body.Username+'</b> ✍ </p>',
                 
              
                });
              
                console.log("Message sent: %s", info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
              
                // Preview only available when sending through an Ethereal account
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    
 



    
    
    
  }

  if(!(req.body.email==getpriviousfrstname.email)){
   
    console.log("Youser email is chnage");

    console.log(req.body.email);
    console.log(getpriviousfrstname.email);

    let testAccount = await nodemailer.createTestAccount();
    console.log("after")
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
                var email=await req.body.email;
                console.log(email)
               console.log("transport visited")
                // send mail with defined transport object
                let info = await transporter.sendMail({
                  from: '"C4fashions" <c4fashions@gmail.com>', // sender address
                  to: email, // list of receivers
                  subject: "user name is update", // Subject line
                  text:
                    "User name is change ", // plain text body
                  html: '<p>This email register as new Email of,User : <b>'+req.body.Username+'</b> 📧</p>',
                 
              
                });
              
                console.log("Message sent: %s", info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
              
                // Preview only available when sending through an Ethereal account
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    
 



    
    
    
  }
  //user table update
  UserSchema.findByIdAndUpdate(req.body.id,{

      "Fullname":req.body.Fullname,
      "Username":req.body.Username,
      "email":req.body.email,
      "Username":req.body.Username,
      "address1":req.body.address1,
},(err,user)=>res.send("updated"))
});



module.exports = router;