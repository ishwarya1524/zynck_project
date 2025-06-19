const jwt=require("jsonwebtoken")

const authMiddleware=(req,res,next)=>{
    const token=req.headers.authorization;

    if(!token)
        return res.status(401).json({message:"no token provided"});

    try{
        const decoded=jwt.verify(token,process.env.jwt_secret);
        req.userId=decoded.id;
        next();
    }
    catch(error){
        res.status(401).json({message:"Invalid Token"});

    }
}

module.exports=authMiddleware;