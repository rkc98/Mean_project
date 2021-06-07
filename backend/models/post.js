const mongoose =require('mongoose');
const postschema=mongoose.Schema({
    title: String,
    content : String,
    imagepath:String
})
module.exports=mongoose.model('Post', postschema)