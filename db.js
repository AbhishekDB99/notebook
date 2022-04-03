const mongoose  = require("mongoose"); 
require('dotenv').config({ path: '.env' });

const connectToMongo = () => {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
}
module.exports= connectToMongo;