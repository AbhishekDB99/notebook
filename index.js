const connectToMongo = require('./db');
var cors = require('cors')
const dotenv = require("dotenv");

dotenv.config();

const express = require('express')
connectToMongo();
const app = express()


app.use(cors())
const port = process.env.PORT || 5000;

app.use(express.json())
// ... other imports 
const path = require("path")

// ... other app.use middleware 
app.use(express.static(path.join(__dirname, "client", "build")))

// ...
// Right before your app.listen(), add this:
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNotebook backend listening on port ${port}`)
})
