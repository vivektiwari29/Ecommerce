const app = require("./app");
const dotenv = require("dotenv")
const connectDatabase = require("./config/database");
const { connect } = require("http2");
const cloudinary = require("cloudinary")


// This is called uncaught error :- Handleing it




process.on("uncaughtException" , (err) => {
    console.log(`Error : ${err.message}`);
    console.log('Shutting down the server due to Uncaught Error')
    process.exit(1);
})


// console.log(Youtube) this is called uncaught error









//  config
dotenv.config({path:"config/config.env"})




// connectiong db after config only

connectDatabase()

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})



const server = app.listen(process.env.PORT  , ()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
})


//  Unhandled Promise Rejection :- mongoDB ki jagah mongo likhne wala error


process.on("unhandledRejection" , (err) => {
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(()=>{
        process.exit(1);
    })
})

