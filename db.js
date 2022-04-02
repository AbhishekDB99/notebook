const mongoose  = require("mongoose"); 

const connectToMongo = () => {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

}
module.exports= connectToMongo;