import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) =>{
    const jwtSecret = process.env.JWT_SECRET;
    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({ error: "No token provided"});
    }
    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded; // Attach user info to request object
        next();
    }catch(err){
        return res.status(401).json({ error: "Invalid token"});
    }
}