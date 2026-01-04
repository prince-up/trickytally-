const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            requierd : true,
        },
        email :{
            type : String,
            requierd : true,
            unique : true,
        },
        password : {
            type : String,
            requierd : true,    

        },
        },
        {timestamps : true}
);
module.exports = mongoose.model("user",userSchema);
