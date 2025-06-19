const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose")
const dotenv=require("dotenv")

dotenv.config()

const app=express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.mongouri,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>console.log("mongodb connected"))
.catch((err)=>console.log("mongoose connection error",err))

const tableRoutes=require("./routes/tableRoutes")
app.use("/",tableRoutes);
app.use("/api/auth",require("./routes/auth"))

app.listen(5000,()=>console.log("server running on port 5000"))