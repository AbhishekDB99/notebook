const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = process.env.SECRET ||  'jsismid';
// ROUTE 1:To create a user endpoint: "/api/auth/createuser"
router.post('/createuser',
  //For validaton
  [body('name', 'Enter valid name').isLength({ min: 3 }),
  body('email', 'Enter valid email').isEmail(),
  body('password', 'Enter valid password').isLength({ min: 5 })],
  async (req, res) => {
    let success =false;
    // If errors , return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    //To check for any errors
    try {
      //To check if the user already exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({success, error: "The user already exists" })
      }
      const salt = await bcrypt.genSalt();
      secPass = await bcrypt.hash(req.body.password, salt);       /*secured password*/
      //Create new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      })
      const data = {
        user: {
          id: user.id
        }
      }
      const authToken = jwt.sign(data, JWT_SECRET);
      let success =true;
      res.json({ success,authToken });
      // res.json(user);
    } catch (error) {
      console.log(error.message);
      res.status(400).send("Internal Server Error");
    }
  })



// ROUTE 2:Authenticate a user endpoint: "/api/auth/login   Login required" 
router.post('/login',
  //For validaton
  body('email', 'Enter valid email').isEmail(),
  body('password', 'Password cannot be blank').exists({ min: 5 }),
  async (req, res) => {

    // If errors , return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Please try to login with correct credentials" });


      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success=false;
        return res.status(400).json({ success,error: "Please try to login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id
        }
      }
      const authToken = jwt.sign(data, JWT_SECRET);
       success = true;
      res.json({success, authToken });

    } catch (error) {
      console.log(error.message);
      res.status(400).send("Internal Server Error");
    }
  })

// ROUTE 3:Get user detail  endpoint: "/api/auth/getuser     Login required" 
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Internal Server Error");
  }
})

module.exports = router