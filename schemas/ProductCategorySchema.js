const mongoose= require('mongoose');
// Student id :IT18045840
//Name :S.D.S.L Dissanayake
const ProductCategorySchema = new mongoose.Schema({
    categoryName:{
        type:String,
        required:true
    },
    categoryDiscription:{
        type: String,
        required: true
    },
    categoryNote:{
        type: String,
        required: true
    },

    subCategory:{
        type: Array,
        required: false
    },
  
  



});
module.exports =mongoose.model('ProductCategorys',ProductCategorySchema,'ProductCategory');