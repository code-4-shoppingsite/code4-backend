const express = require('express');
const router =express.Router();
const bodyParser =require('body-parser');
const core = require('cors');
const fs= require('fs');

router.use(bodyParser());
router.use(core());

// Student id :IT18045840
//Name :S.D.S.L Dissanayake
let ProductCategory = require('../schemas/ProductCategorySchema');

//Add product category
router.route('/add').post((req,res)=>{
    const categoryName=req.body.productCategoryName;
    const categoryDiscription=req.body.productCategoryDiscription;
    const categoryNote=req.body.productCategoryNote;
    const subCategory=req.body.subCategoryArry;

    const newProductCategory=new ProductCategory({
        categoryName,
        categoryDiscription,
        categoryNote,
        subCategory
    })

    newProductCategory.save()
        .then(newProductCategory=>res.json('new product category added'))
        .catch(err=>res.status(400).json('Error in Create new product category '+err));


});

//get selected product category
router.route('/:id').get((req,res)=>{
    ProductCategory.findById(req.params.id)
        .then(exercise=>res.json(exercise))
        .catch(err=>res.status(400).json('Error: '+err));
});
//Get all product category
router.route('/').get((req,res)=>{
    ProductCategory.find()
        .then(exercise=>res.json(exercise))
        .catch(err=>res.status(400).json('Error: '+err));
});
//delete selected product category
router.route('/:id').delete((req,res)=>{
    ProductCategory.findByIdAndDelete(req.params.id)
        .then(storemanager=>res.json('product category delete'))
        .catch(err=>res.status(400).json('Error: '+err));
});


//update selected product category

router.route('/update/:id').post((req,res)=>{
    seletectd_category_id=req.params.id;

    let updatedcategoryName=req.body.categoryName;
    let updatedcategoryDiscription=req.body.categoryDiscription;
    let updatedcategoryNote=req.body.categoryNote;  
    let updatedsubCategory=req.body.subCategory;  

    ProductCategory.findByIdAndUpdate(seletectd_category_id,{
        "categoryName":updatedcategoryName,
        "categoryDiscription":updatedcategoryDiscription,
        "categoryNote":updatedcategoryNote,
        "subCategory":updatedsubCategory
    },(err,product_category)=>res.send("updated"))
    
});






module.exports = router;