// Common api authentication for JWT by v.d dantanarayana
require ('dotenv').config();
const jwt = require("jsonwebtoken");

module.exports = function authenticateToken(req,res,next){
    const authHeader=req.headers['authorization']
    const token=authHeader && authHeader.split(' ')[1]
    if(token==null) return res.json({success:false,status:401})
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,decode)=>{
    
      if(err) return res.json({success:false,status:403})
      console.log("hello"+req.decode);
      req.decode=decode;
      next();
    
    });
    
    
    }
