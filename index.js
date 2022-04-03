const connectToMongo = require('./db');
var cors = require('cors')
require("dotenv").config({ path: ".env" });


const express = require('express')
require('dotenv').config({ path: '.env' });

connectToMongo();
const app = express()


app.use(cors())
const port = process.env.PORT || 5000;

app.use(express.json())

if(process.env.NODE_ENV === "production"){
  app.use(express.static("client/build"));
  app.get("/",(req,res)=>{
    const path1 = require("path");
    res.sendFile(path1.resolve(__dirname,'client','build','index.html'));
  })
}

// console.log(path1.resolve(__dirname,'client','build','index.html'));


app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNotebook backend listening on port ${port}`)
})
