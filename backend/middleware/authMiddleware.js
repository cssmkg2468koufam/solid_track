const jwt = require("jsonwebtoken");

const protect = (res, req, next)=> {
    const token= req.header("Authorization")?.replace("Bearer ","");

    console.log("Token from header:", token);

    if (!token){
        return res.status(401).json({error:"Access denied. No token provided"});    
    }

    try {
        const decoded =jwt.verify(token, "your_jwt_secret");
        req.user =decoded;
        console.log("Authenticated user:", req.user);
        next();
    }catch (error){
        res.status(400).json ({error:"invalid token"});

    }
}

module.exports= {protect}