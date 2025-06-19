const mongoose=require("mongoose")

const tableschema=new mongoose.Schema({
    tableName:String,
    columns:[String],
    rows:[
        {rowData:mongoose.Schema.Types.Mixed,

        },
    ],
        user: {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
});

module.exports=mongoose.model("Table",tableschema)