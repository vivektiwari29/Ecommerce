const ErrorHandler = require("../utils/errorHandler")




module.exports = (err , req , res , next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    // Wrong mongoDB ID 
    if(err.name === "CastError"){
        const message = `Resource not found . Invalid : ${err.path}`;
        err = new ErrorHandler(message , 400)
    }



    // Wrong JWT
    if(err.name === "JsonWebTokenerror"){
        const message = `JSON Web Token is Invalid`;
        err = new ErrorHandler(message , 400);
    }


    // Token Expired Error
    if(err.name === "TokenexpiredError"){
        const message= `Token is Expired`;
        err = new ErrorHandler(message , 400);
    }


    // Mongoose duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue )} entered`
        err = new ErrorHandler(message , 400);
    }


    res.status(err.statusCode).json({
        success : false,
        message : err.message
    })

}