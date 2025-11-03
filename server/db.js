
const mongoose = require('mongoose');

 const connectDB = async () => {
    try{

       await mongoose.connect(process.env.MONGO_URI,{
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log('Database connected'); 

    }
    catch(error){
        console.log( 'Database connection failed',error);
    }
} 

module.exports = connectDB