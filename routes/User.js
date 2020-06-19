// User management by V.D Dantanarayana
const express=require('express');
const authenticateToken = require('./authenticateToken');

const router=express.Router();
const uniqid=require('uniqid');
const bodyParser=require('body-parser');
const core = require('cors');
const UserSchema=require('../schemas/UserSchema');
const DeleteUserSchema=require('../schemas/DeletedUserSchema');

const crypto=require('crypto');
const nodemailer=require('nodemailer');
router.use(bodyParser());
router.use(core());
var UID;
const Hogan= require('hogan.js');
const fs=require('fs');
var template = fs.readFileSync('./views/Etemplate.hjs','utf-8');
var comileTemplate=Hogan.compile(template);

//adding user to system (registering user) and sending verification mail - create
router.post('/addUser',async function(req,res){

try{

  var data=await  UserSchema.findOne({Username:req.body.Username});
  var data1=await  UserSchema.findOne({email:req.body.email});
 
  if(data===null || data1===null)
  {

    var newQuery=[];
    UID=uniqid();

    newQuery=req.body;
    newQuery['uid']=UID;
    newQuery['regDate']=new Date();
    newQuery['newPassword']="",
    newQuery['isdeleted']=false;
    newQuery['mobile']="",
    newQuery['nic']="",
    newQuery['address1']="",
    newQuery['address2']="",
    newQuery['city']="",    
   
   
   token=await crypto.createHash('md5').update(UID+new Date()).digest('hex');

    const newUser=new UserSchema(newQuery);
    await newUser.save(async function(err,product){

        if (err) {
            console.error(err);
            res.status(500).send( "Eroor"+err);
        }else{
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
              html: '<a href="'+process.env.FROUNTENDURL+'/RegisterConfirm?token='+token+'&user_id='+product._id+'">Click to register</a>',
             
          
            });
          
            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
          
            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

            res.json({success:true});
        
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








//forget password and password verification email- update
router.post('/forgotpassword',async function(req,res){

  try{
  
    
    var data=await  UserSchema.findOne({email:req.body.email});
   
    if(data!==null)
    {
  
      
     var UID=uniqid();
  
      
     
     var token=await crypto.createHash('md5').update(UID+new Date()).digest('hex');
  
      var userid=data['_id'];
    
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
              var email=await data["email"];
              console.log(email)
            console.log("transport visited")
              // send mail with defined transport object
              let info = await transporter.sendMail({
                from: '"C4fashions" <c4fashions@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "complete Forgot password", // Subject line
                text:
                ""+process.env.FROUNTENDURL+"/RegisterConfirm?token="+token+"&user_id="+userid+"", // plain text body
                html: '<a href="'+process.env.FROUNTENDURL+'/resetpassword?token='+token+'&user_id='+userid+'">Click to reset password</a>',
               
            
              });
            
              console.log("Message sent: %s", info.messageId);
              // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            
              // Preview only available when sending through an Ethereal account
              console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
              // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  
              res.json({success:true});
          
            }catch(e)
            {
              console.log(e)
              res.json({success:false});
            }
          
  
    }else{
  
      res.json({success:false,err:"There is no user with this email"});
    }
  
  }catch(e)
  {
    console.log(e);
    res.send(e);
  }
  });
  








// adding token and password to system - update
router.route('/addtoken').post((req,res)=>{
 

      UserSchema.findByIdAndUpdate(req.body.id,{
 
        "newPassword":req.body.newPassword,
        "token":req.body.token
    },(err,user)=>res.send("updated"))
});




// updating user details - update
router.route('/updateuser').post((req,res)=>{
 

  UserSchema.findByIdAndUpdate(req.body.id,{

    "Fullname":req.body.Fullname,
      "mobile":req.body.mobile,
      "nic":req.body.nic,
      "Username":req.body.Username,
      "address1":req.body.address1,
      "address2":req.body.address2,
      "city":req.body.city,
},(err,user)=>res.send("updated"))
});


// updating password - update
router.route('/updatepass').post((req,res)=>{
 
 

  UserSchema.findByIdAndUpdate(req.body.id,{

    "newPassword":req.body.newPassword,
      
},(err,user)=>res.send("updated"))
});


//getting user details by id - retrieve
router.get("/getuserbyid",async function(req,res){

  var data=await UserSchema.find(req.query);

  if(data===null)
  {
    res.json({success:false,err:"no id"})
  }else{

res.json({success:false,data:data})
  }


})

//removing user from schema and adding to user delete schema - delete and create
router.post("/removeuser",authenticateToken,async function(req,res){


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

})





router.get("/", function (req, res) {
    res.send("hello");
  });


router.post("/sendmail",async function (req,res) {


    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "c4fashions@gmail.com", // generated ethereal user
            pass: process.env.EMAILPASS, // generated ethereal password
        },
    });


    try {
        let info = await transporter.sendMail({
            from: 'CFashion', // sender address
            to: req.body.mail, // list of receivers
            subject: req.body.subject.toString().trim(), // Subject line
            text: "Dear "+req.body.name , // plain text body
            html: comileTemplate.render({url:process.env.BACKENDURL,furl:process.env.FROUNTENDURL, name:req.body.name ,message:"Thank You for message us. we will response you as soon as possible"})


        });
        let info2 =  transporter.sendMail({
            from: 'CFashion New Message ', // sender address
            to: "c4fashions@gmail.com", // list of receivers
            subject: "New massage", // Subject line
            html: 'new message from '+req.body.name+'<br>'+req.body.message


        });
        res.status(200).send("success");

    }catch (e) {
        res.status(404).send("errror");
    }








})



module.exports = router;