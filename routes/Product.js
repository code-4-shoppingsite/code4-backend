const express = require('express');
const router =express.Router();
const uniqid = require('uniqid');
const bodyParser =require('body-parser');
const fileUpload = require('express-fileupload');
const core = require('cors');
const fs= require('fs');
const io = require('socket.io')(3030)
// const Suggsions= require('../Functions/Suggesions');

const productSchema = require('../schemas/ProductSchema');
const productcategory= require('../schemas/ProductCategorySchema');
const reviewSchema = require('../schemas/Review');
const users = {};
io.on('connection', socket => {

    socket.on('addReview', review => {

        socket.broadcast.emit('newReview', review);
    });

    socket.on('NotifyUpdateReview', updateReview => {

        socket.broadcast.emit('updateReview',updateReview);

    });

    socket.on('ChangeProduct', product => {
        socket.broadcast.emit('NotifyProductChange',product);

    });





});

var pId;
router.get('/',function (req,res) {
    res.send("product root");
});

router.use(bodyParser());
router.use(fileUpload());
router.use(core());
router.get('/getProducts',async function (req,res) {

    try {

        if (req.query.s){
            delete req.query.s;

            var set=parseInt(req.query.sets);
            if (req.query.maxprice!=""){


                req.query['price']={$gte: parseInt(req.query.minprice),$lte: parseInt(req.query.maxprice)};

            }
            delete req.query.sets;
            delete req.query.maxprice;
            delete req.query.minprice;

            let limit =parseInt(req.query.limit);
            delete req.query.limit;
            var data=await productSchema.find(req.query).sort( { totClicks: -1 } ).skip(set).limit(limit).sort({_id:-1});
            res.send(data);
        }else {
            res.status(500).send("query err");
        }
    }catch (e) {
        console.log(e);
        res.status(500).send("err " + e);
    }

});


router.get('/myShop',async function (req,res) {

    try {
            delete req.query.s;
            var set=parseInt(req.query.sets);
            delete req.query.sets;
            let limit =parseInt(req.query.limit);
            delete req.query.limit;
            var data=await productSchema.find(req.query).skip(set).limit(limit).sort({_id:-1}).sort({addDate:-1});
            res.send(data);

    }catch (e) {
        console.log(e);
        res.status(500).send("err " + e);
    }

});






router.get('/getProduct',async function (req,res) {

    try {

        if (req.query.s){
            delete req.query.s;
             var data=await productSchema.find(req.query);
             res.send( data);
        }else {
            res.status(500).send("query err");
        }
    }catch (e) {
        console.log(e);
        res.status(500).send("err " + e);
    }
});




router.get('/getSingelProduct',async function (req,res) {

    try {

        if (req.query.s){
            delete req.query.s;

            if (req.query.tclick==='true'){
                var result=  await productSchema.updateOne({id:req.query.id},{ $inc:{totClicks:1}});
                delete req.query.tclick;

            }
            delete req.query.tclick;


            var data=await productSchema.find(req.query);
            var pCaID=data[0].catogory;



            var catogoryData= await productcategory.find({_id:pCaID});
            data[0]['catogory']=catogoryData[0].categoryName;
            data[0]['_id']=pCaID;






            res.send( data);
        }else {
            res.status(500).send("query err");
        }
    }catch (e) {
        console.log(e);
        res.status(500).send("err " + e);
    }
});





router.get('/getSearchProduct',async function (req,res) {

    try {
        if (req.query.s){
            delete req.query.s;

            var set=parseInt(req.query.sets);


                req.query['price']={$gte: parseInt(req.query.minprice),$lte: parseInt(req.query.maxprice)};

                delete req.query.sets;
                delete req.query.maxprice;
                delete req.query.minprice;
            let limit =parseInt(req.query.limit);
            delete req.query.limit;

            var searchOptions;
            searchOptions=new RegExp(req.query.key,'i');
            delete req.query.key;
            req.query['proName']=searchOptions;
            console.log(req.query)
            var data=await productSchema.find(req.query).skip(set).limit(limit).sort( { totClicks: -1 } );
            console.log(data.length,set);
            res.send( data);
        }else {
            res.status(500).send("query err");
        }
    }catch (e) {
        console.log(e);
        res.status(500).send("err " + e);
    }
});

router.get('/getAllProduct',async function (req,res) {
    console.log(req.query);
    try {
        if (req.query.s){

            let set=parseInt(req.query.sets);
            let limit=parseInt(req.query.limit);



            var data=await productSchema.find({}).skip(set).limit(limit).sort( { totClicks: -1 } );
            console.log(data.length,set);
            res.send( data);
        }else {
            res.status(500).send("query err");
        }
    }catch (e) {
        console.log(e);
        res.status(500).send("err " + e);
    }
});







router.get('/letestProduct',async function (req,res) {

    try {
        // console.log(req.query);
        if (req.query.s){
            delete req.query.s;
            console.log(req.query);
            var data=await productSchema.find({}).sort({addDate:-1}).limit(8);
            res.send( data);
        }else {
            res.status(500).send("query err");
        }
    }catch (e) {
        console.log(e);
        res.status(500).send("err " + e);
    }
});



router.post('/deleteImage',async  function (req,res) {
console.log(req.body);

    var result=await productSchema.updateOne({id:req.body.id},{images:req.body.uImages});
    if (result.ok==1){
        fs.unlink("."+req.body.img,function (err) {
            if (err){
                res.status(404).send(err)
            }else{
                res.send( req.body.id+" deleted");
            }

        })
    }else {
        res.status(404).send("parameter error");
    }



});

router.post('/deleteProduct',async function (req,res) {
    try {
        if (req.body.isDelete){
            console.log("id ",req.body);
            var data= await  productSchema.findOne({id:req.body.id})
            console.log("no find err ");
            for (var i=0;i<data.images.length;i++){
                fs.unlink("."+data.images[i],function (err) {
                    if (err){
                        res.status(404).send("image delete error");
                    }
                });
            }
            productSchema.deleteOne({'id':req.body.id},function (err) {
                if (err){
                    console.log("error"+err);
                    res.status(500).send(err);
                }else{
                    res.send("ok");
                }
            });
        } else{
            res.status(404).send("error query");
        }
    }catch (e) {

    }


});


router.post('/updateProduct',async  function (req,res) {

let newdata=req.body;
    newdata['addDate']=new Date();
pId=  req.body.id;

    let productImages =[];
    req.body['proimages'].forEach(img=>{
        productImages=['/uploads/products/'+pId+'_'+img,...productImages]
    });
    delete newdata.id;


    newdata={ '$addToSet':{
            images:productImages
        },...newdata};
    console.log(newdata);
   var result =await productSchema.updateOne({id:pId},newdata);
console.log(result)
   if (result.ok==1){
       console.log("ok",result);
       res.send(pId);
   }else{
       res.status(404).send("parameter error");
   }





});


router.post('/addProduct',async function (req,res) {

    try {
        var newQuery=[];
    pId=uniqid()
    let productImages =[];
    req.body['proimages'].forEach(img=>{
        productImages=['/uploads/products/'+pId+'_'+img,...productImages]
    });

    newQuery=req.body;

    newQuery['id']=pId;
    newQuery['addDate']=new Date();
    newQuery['images']=productImages;
    newQuery['totClicks']=0;

    console.log(newQuery);

    const newProduct = new productSchema(newQuery);
    await newProduct.save(function (err, product) {
        if (err) {
            console.error(err);
            res.status(500).send( "Eroor"+err);
        }
        console.log(product.proName + " saved");
        res.redirect('/product/sucess');
    });
}catch (e) {

}

});

router.post('/uploadProduct',async (req, res) => {

    try{
        if (req.files.file.length>1){
            req.files.file.forEach(data=>{
                if (data === null) {
                     res.status(400).json({ msg: 'No file uploaded' });
                }else{
                    data.mv(`./uploads/products/${pId}_${data.name}`, err => {
                        if (err) {
                            console.log("cannot upload "+err);
                            productSchema.deleteOne({'id':pId},function (err) {
                                if (err){
                                    console.log("error"+err);
                                     res.status(500).send(err);
                                }else{
                                     res.status(500).send(err);
                                }

                            });

                        }else{

                        }
                    });
                }
            });
            res.send(pId);
        }else{
            const data=req.files.file;

            if (data === null) {
                 res.status(400).json({ msg: 'No file uploaded' });
            }else{
                data.mv(`./uploads/products/${pId}_${data.name}`,async err => {
                    if (err) {
                        console.log("cannot upload "+err);
                        productSchema.deleteOne({'id':pId}, function (err) {
                            if (err){
                                console.log("error"+err);
                                 res.status(500).send(err);
                            }else{
                                 res.status(500).send(err);
                            }

                        });
                    }else{
                   res.send(pId);

                    }
               });
            }
        }

    }catch (e) {
        console.log(e);
    }
});

router.get('/sucess',function (req,res) {
    res.send({resp:"ok"});
});



/*
router.get('/subCatogory',function (req,res) {

    const path='../File/subCatagory.txt';
    console.log(path)


    fs.writeFile(path, "hrllo", function(err) {
        if (err)res.status(404).send(err)
        else res.send("ok");

    });
});

router.post('/addCatogory',function (req,res) {



});
*/
router.post('/addReview',async function (req,res) {

    try {
        var newQuery=[];
        newQuery=req.body;
        newQuery['addDate']=new Date();


        console.log(newQuery);

        const nReviewew = new reviewSchema(newQuery);
        await nReviewew.save(function (err) {
            if (err) {
                console.error(err);
                res.status(500).send( "Eroor"+err);
            }
            console.log("Review saved");
            res.redirect('/product/sucess');
        });
    }catch (e) {
        res.status(404).send( "Eroor"+e);
    }

});

router.get('/getReviews',async function (req,res) {

    try {
        // console.log(req.query);
        if (req.query.s){
            delete req.query.s;
            console.log("review",req.query);

            var data=await reviewSchema.find(req.query).sort({addDate:-1});
            res.send( data);
        }else {
            res.status(500).send("query err");
        }
    }catch (e) {
        console.log(e);
        res.status(500).send("err " + e);
    }
});


router.post('/updateReviews',async function (req,res) {

    try {
         console.log(req.body);
        let rId= req.body.rid;
        let query={isblock:req.body.action}
        let pId=req.body.pid;
        var result =await reviewSchema.updateOne({_id:rId},query);
        console.log(result);
        res.send(pId);

    }catch (e) {
        console.log(e);
        res.status(500).send("err " + e);
    }
});



module.exports = router;