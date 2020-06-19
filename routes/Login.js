// Login and authentication by V.D Dantanarayana
require ('dotenv').config();
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const core = require("cors");
const jwt = require("jsonwebtoken");
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const UserSchema=require('../schemas/UserSchema');
router.use(bodyParser());
router.use(core());

// User login and accesstoken creation
router.post('/login',async function (req,res) {

  try{
  var pass=req.body.newPassword.trim();
   var data=await  UserSchema.findOne({Username:req.body.Username});
   

   if (data===null){
          res.json({success:false,err:"Invalid Username"})
      }else {
        console.log(data["newPassword"]);
          if (data.newPassword.trim()===pass){
              const accTocken=data['token'].trim();
              console.log("this is token"+accTocken);
              const token=jwt.sign(accTocken,process.env.ACCESS_TOKEN_SECRET);
              res.json({success:true,accessToken:token,type:data['type'],id:data['id'],data:data})
             
          }else{
            res.json({success:false,err:"Invalid password"})
          }
      }
    }catch(e){
      console.log(e)
      res.json({success:false,err:"error "})
    }
});



router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
res.send('i\'m protected');
});

router.get('/getUser', passport.authenticate('jwt', { session: false }), (req, res) => {
console.log(req.headers);
res.send(req.id);
});

// api athentication check
function authenticateToken(req,res,next){
const authHeader=req.headers['authorization']
const token=authHeader && authHeader.split(' ')[1]
if(token==null) return res.sendStatus(401)

jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,decode)=>{

  if(err) return res.sendStatus(403)
  console.log("hello"+req.decode);
  req.decode=decode;
  next();

});


}

router.get("/",authenticateToken, function (req, res) {
  res.send("hello");
});
module.exports = router;
