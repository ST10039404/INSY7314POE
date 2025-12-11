import jwt from "jsonwebtoken";

//Checks if token is valid before proceeding
const checkauth=(req,res,next) =>
{
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWTSECRET)
        next();
    }
    catch
    {
        res.status(401).json({
            message: "Token is invalid"
        })
    }
}

//Modified Check-Auth for employees
const checkAuthEmp=(req, res, next) =>
{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(token, process.env.JWTSECRET);
        if (user.role == "employee")
        {
            next()
        }
        else
        {
            res.status(403).json({
                message: "Lack of authority"
            })
        }
        
    }
    catch(error)
    {
        res.status(401).json({
            message: "Invalid token",
            error: error.message
        })
    }
}

export { checkauth, checkAuthEmp };