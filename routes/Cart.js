const express = require('express');
const router =express.Router();
const bodyParser =require('body-parser');
const core = require('cors');
const fs= require('fs');

router.use(bodyParser());
router.use(core());

let Cart = require('../schemas/CartSchema');

// Student id :IT18045840
//Name :S.D.S.L Dissanayake


//Add new storemanager
router.route('/add2').post((req,res)=>{
    console.log("product filed")
    console.log(req.body.products);
    console.log("======================")
    

    const user_id=req.body.user;
    const products=req.body.products;
    const qnty=req.body.qty;

    const newCart={
        "user":user_id,
        "products":{
            "product":products,
            "quntity":qnty
        },
        "isOrder":false
    }

    Cart.count({user:user_id},(err,count)=>{
        if(count>0){
            console.log("push");

            let newProduct={
                "product":products,
                "quntity":qnty

            }

            console.log(newProduct);
            
            
            Cart.updateOne({user:user_id},{ $push:{ products:newProduct}},
                (err,product)=>{
                    res.send(product)

                    
                }
            
            )

        }else{

            Cart.update({user:user_id},newCart,{upsert: true})
            .then(newStoremanager=>res.json('new cart added'))
            .catch(err=>res.status(400).json('Error in Create new cart create '+err));
    
    
        }
    })


   
  
});


router.route('/add').post(async function (req,res){
    console.log(req.body.user);
        
    const user_id=req.body.user;
    const products=req.body.products;
    const qnty=req.body.qty;
               
    await Cart.find({"user":user_id,"products.id":products.id,"isOrder":false})
         .then(async function (res1) {
             console.log("add to cart");
            if(res1.length>0){
                console.log("add to cart length 1");
              let  x= await Cart.updateOne( {"user":user_id,"products.id":products.id,"isOrder":false},{ $inc: {"quntity":1}});
                  if (x.ok==1){
                      res.send("success");
                  } else {
                      res.status(500).send("cart update fail");
                  }
            }else{
                console.log("add to cart  new ");
                const newItems =new Cart({
                    "user":user_id,
                    "products":products,
                    "quntity": qnty,
                    "isOrder":false
        
            });
        
            newItems.save()
                .then(newItems=>res.json("new Item added"))
                .catch(err=>res.status(400).json('Error in add Items'+err));
            }
         })
         .catch(err =>{
             console.log("Does not exist product");
             res.status(400).json('Error in add Items'+err)
         })

})

//Items isOrder state change

router.route('/isorder/:id').post((req,res)=>{
    let items_id=req.params.id;

    Cart.findByIdAndUpdate(
        items_id,
       {            
            "isOrder": true,        
       
       },(err,cart)=>{
          
           res.send(cart);
          
       }
    )


})


router.route('/quntity/:id').put((req,res)=>{
    let quntityChangeItemID=req.params.id;
   
    let newQuntity=req.body.quntity;

        console.log(newQuntity);
    
        Cart.findByIdAndUpdate(
            quntityChangeItemID,
            {$set:{"quntity":newQuntity}},
            (err,item)=>{
                res.send(item)
            }
        )
})






//Delete selected product
router.route('/:id').delete((req,res)=>{
    Cart.findByIdAndDelete(req.params.id)
        .then(cart=>res.json('cart delete'))
        .catch(err=>res.status(400).json('Error: '+err));
});

//get selected cart
// router.route('/:id').get((req,res)=>{
//     Cart.findById(req.params.id)
//         .then(cart=>res.json(cart))
//         .catch(err=>res.status(400).json('Error: '+err));
// });

router.route('/:id').get((req,res)=>{
    Cart.find({user:req.params.id})
        .then(cart=>res.json(cart))
        .catch(err=>res.status(400).json('Error: '+err));
});


//Get all cart
router.route('/').get((req,res)=>{
    Cart.find()
        .then(cart=>res.json(cart))
        .catch(err=>res.status(400).json('Error: '+err));
});


//update selected product storemanager

router.route('/update/:id').post((req,res)=>{

    let selected_id=req.params.id;

    // let card_id=req.body.card_id;
    // let products=req.body.products;
    // let qunitity=req.body.qunitity;
    
    
    console.log("recive_data: "+user+products+qunitity);
    
       

    Cart.findByIdAndUpdate(
         selected_id,
        { 
            
                "user": user,
                "products":products,
                "qunitity":qunitity
                
                
        
        },(err,cart)=>{
           
            res.send(cart);
           
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



module.exports = router;