const Product = require("../models/productModel");
const Errorhandler = require("../utils/errorHandler");
const catchAsyncerrors = require("../middleware/catchAsyncErrors")
const ApiFeatures = require("../utils/apifeatures")
const cloudinary = require("cloudinary")



// create product in the Database -- Admin

// exports.createProduct = catchAsyncerrors( async(req , res , next)=>{

//     let images = []

//     console.log("HAHAHAHA" , req.body.images);


//     if(typeof req.body.images === "string"){
//         images.push(req.body.images)
//     }
//     else{
//         images = req.body.images
//     }

//     const imagesLinks = [];

//     for(let i = 0 ; i < images.length ; i++){
//         const result = await cloudinary.v2.uploader.upload(images[i] , { folder : "products"})

//         imagesLinks.push({
//             public_id : result.public_id,
//             url : result.secure_url
//         })

//     }

//     req.body.images = imagesLinks;


//     req.body.user = req.user.id;

//     const product = await Product.create(req.body);
//     res.status(201).json({
//         success : true,
//         product
//     })
// })



exports.createProduct = catchAsyncerrors(async (req, res, next) => {
    let images = [];

    // Check if req.body.images is an array or string and standardize it to an array
    if (typeof req.body.images === "string") {
        images.push(req.body.images); // Handle single image
    } else {
        images = req.body.images; // Multiple images
    }

    // Log to check the contents of images array
    console.log("Images array:", images);

    // Ensure all elements in images array are strings
    if (!images.every(img => typeof img === "string")) {
        return next(new Errorhandler("Invalid image format", 400));
    }

    const imagesLinks = [];

    // Upload each image to Cloudinary
    for (let i = 0; i < images.length; i++) {
        try {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            return next(new ErrorHandler("Image upload failed", 500));
        }
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
    });
});





// get products from the Database

exports.getAllProducts = catchAsyncerrors(async (req , res , next) => {

    // return next(new Errorhandler("This is my temp error" , 500))
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find() , req.query)
        .search()
        .filter()

    let products = await apiFeature.query

    let filteredProductsCount = products.length

    apiFeature.pagination(resultPerPage)
   
    products = await apiFeature.query.clone();

     res.status(200).json({
        success : true ,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount

    });
})


// Get all products -- admin

exports.getAdminProducts = catchAsyncerrors(async (req , res , next) => {

    const products = await Product.find();

     res.status(200).json({
        success : true ,
        products,
    });
})



//  Get product details

exports.getProductDetails = catchAsyncerrors(async(req , res , next) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new Errorhandler("Product not found" , 404))
    }


    res.status(200).json({
        success:true,
        product,
        // productCount
    })
})




// update product    -- Admin

exports.updateProduct = catchAsyncerrors(async (req , res , next) => {
    let product =await Product.findById(req.params.id);

    if(!product){
        return next(new Errorhandler("Product not found" , 404))
    }


    // updating images in cloudinary 

    let images = [];
    if(typeof req.body.images === "string"){
        images.push(req.body.images);
    }
    else{
        images = req.body.images
    }


    if(images !== undefined){

        // deleting purani images 

        for(let i = 0 ; i < product.images.length ; i++){
            await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }

        const imagesLinks = [];

        for(let i=  0 ; i < images.length ; i++){

            const result = await cloudinary.v2.uploader.upload(images[i] , {folder: "products"})
    
            imagesLinks.push({
                public_id : result.public_id,
                url : result.secure_url
            })
        }

        req.body.images = imagesLinks;

    }




    product = await Product.findByIdAndUpdate(req.params.id , req.body , {
        new:true , 
        runValidators:true , 
        useFindAndModify : false
    })

    res.status(200).json({
        success:true ,
        product
    })
})






// Delete Product -- Admin

exports.deleteProduct = catchAsyncerrors(async (req , res , next) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new Errorhandler("Product not found" , 404))
    }



    // deleting images from cloudinary

    for(let i = 0 ; i < product.images.length ; i++){

        await cloudinary.v2.uploader.destroy(product.images[i].public_id)

    }

    await Product.deleteOne({ _id: req.params.id });
    res.status(200).json({
        success:true,
        message:"Product Deleted Successfully"
    })
})



// Create new review or update the review 

exports.createProductReview = catchAsyncerrors(async (req , res , next) => {

    const {rating , comment  , productId} = req.body

    const review = {
        user : req.user._id,
        name : req.user.name,
        rating : Number(rating),
        comment
    }


    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(  (rev) => rev.user.toString() === req.user._id.toString())

    if(isReviewed){

            product.reviews.forEach(rev => {
                if(rev.user.toString() === req.user._id.toString()){
                rev.rating = rating ,
                rev.comment = comment
                }
            })
    }else{
        product.reviews.push(review)
        product.numbOfReviews = product.reviews.length
    }


    let avg = 0;

    product.reviews.forEach(rev => {
        avg = avg + rev.rating
    })


    product.ratings = avg/product.reviews.length


    await product.save({validateBeforeSave : false})

    res.status(200).json({
        success : true
    })


})



// get all reviews of a single product

exports.getProductReviews = catchAsyncerrors(async (req , res , next) => {
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new Errorhandler("Product not found" , 404));
    }


    res.status(200).json({
        success : true,
        reviews : product.reviews
    })
})


// Delete Review

// exports.deleteReview = catchAsyncerrors(async (req , res , next) => {
//     const product = await Product.findById(req.query.productId)

//     if(!product){
//         return next(new Errorhandler("Product not found" , 404));
//     }

//     const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString())

    
//     let avg = 0;

//     reviews.forEach(rev => {
//         avg = avg + rev.rating
//     })


//     const ratings = avg/reviews.length

//     const numOfReviews = reviews.length

//     await Product.findByIdAndUpdate(req.query.productId , {
//         reviews,
//         ratings,
//         numOfReviews
//     },{
//         new:true,
//         runValidators: true,
//         useFindAndModify : false
//     })

//     res.status(200).json({
//         success : true ,
//     })
// })





exports.deleteReview = catchAsyncerrors (async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new Errorhandler("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });

