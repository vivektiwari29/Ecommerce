const Errorhandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail.js")
const crypto = require("crypto")
const cloudinary = require("cloudinary")


// Register a user

exports.registerUser = catchAsyncErrors(async (req , res , next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar , {
        folder: "avatars",
        width: 150,
        crop: "scale"
});

    const {name , email , password} = req.body;
    const user = await User.create({
        name , email , password , avatar:{
            public_id : myCloud.public_id,
            url : myCloud.secure_url
        }
    });

    sendToken(user , 201 , res)


})






// Login user 

exports.loginUser = catchAsyncErrors(async ( req , res , next)=>{
    const {email , password} = req.body;


    // checking if user had given password and email

    if(!email || !password){
        return next(new Errorhandler("Please Enter Email and Password", 400))
    }

    const user = await User.findOne( { email }).select("+password");

    if(!user) {
        return next(new Errorhandler("Invalid Email or Password"), 401);        
    }


    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new Errorhandler("Invalid Email or password"), 401);
    }


    sendToken(user , 200 , res)

})





// logout user


exports.logout = catchAsyncErrors(async(req , res , next)=>{

    res.cookie("token" , null , {
        expires : new Date(Date.now()),
        httpOnly : true
    })



    res.status(200).json({
        success: true,
        message : "Logged out  successfully"
    }) 
})




// Forgot Password


exports.forgotPassword = catchAsyncErrors(async (req , res , next)=>{
    const user = await User.findOne({email : req.body.email});

    if(!user){
        return next(new Errorhandler("user not found ", 404));
    }


    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email , then please ignore it`;


    try {
        await sendEmail ({
            email : user.email,
            subject : `Ecommerce Password Recover`,
            message,
        });

        res.status(200).json({
            success: true,
            message : `Email sent to ${user.email} successfully`
        })
    }
    catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave : false});

        return next (new Errorhandler(error.message , 500))
    }


})



exports.resetPassword = catchAsyncErrors( async (req , res , next) => {


    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{ $gt: Date.now() },
    });

    if (!user){
        return next(new Errorhandler("Reset Password Token is invalid or has been expired" , 400));
    }

    

    if(req.body.password !== req.body.confirmPassword){
        return next(new Errorhandler("Password does not match"));
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();


    sendToken(user , 200 , res);
})




// Get User Detail

exports.getUserDetails = catchAsyncErrors(async(req , res , next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success : true ,
        user
    })

})



// Update user password

exports.updatePassword = catchAsyncErrors(async(req , res , next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new Errorhandler("Old password is incorrect" , 400));
    }


    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new Errorhandler("Password does not match" , 400));
    }


    user.password = req.body.newPassword;

    await user.save()

    sendToken(user , 200 , res);

})






exports.updateProfile = catchAsyncErrors(async (req , res , next) => {
    const newUserData = {
        name : req.body.name,
        email : req.body.email
    }

    // We will add cloudnary
    if(req.body.avatar !== ""){
        const user = await User.findById(req.user.id)

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId)

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar , {
            folder: "avatars",
            width: 150,
            crop: "scale"
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url : myCloud.secure_url
        }


    }



    // cloudinary added

    const user = await User.findByIdAndUpdate(req.user.id , newUserData , {
        new : true ,
        runValidators : true,
        useFindAndModify : false
    });



    res.status(200).json({
        success : true,
    });


});




// Get all users ( admin )

exports.getAllUser = catchAsyncErrors(async (req , res , next) => {
    const users = await User.find();

    res.status(200).json({
        success : true ,
        users
    })
})


// Get single user detail ( admin ) 

exports.getSingleUser = catchAsyncErrors(async (req, res , next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new Errorhandler(`User does not exist with ID : ${req.params.id}`));
    }

    res.status(200).json({
        success : true,
        user
    })

})




// Update user roles ( admin )

exports.updateUserRole = catchAsyncErrors(async (req , res , next) => {
    const newUserData = {
        name : req.body.name,
        email : req.body.email,
        role : req.body.role
    }

    // let user = User.findById(req.params.id);

    // if(!user){
    //     return next (
    //         new Errorhandler(`User does not exist with Id : ${req.params.id}` , 400)
    //     )
    // }

    const user = await User.findByIdAndUpdate(req.params.id , newUserData , {
        new : true , 
        runValidators : true,
        useFindAndModify : false
    })

    res.status(200).json({
        success : true
    })
})




// Delete user ( admin )

exports.deleteUser = catchAsyncErrors(async (req , res , next) => {


    const user = await User.findById(req.params.id);

    if(!user){
        return next(new Errorhandler(`User does not exist with ID : ${req.params.id}` , 400))
    }

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId)



    // in newer version of mongoose , .remove() is changed to .deleteOne()
    await user.deleteOne();

    res.status(200).json({
        success : true,
        message : "User Deleted Successfully"
    })
})

