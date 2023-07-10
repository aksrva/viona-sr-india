require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Users } = require("../model/Users");
const { default: mongoose } = require("mongoose");
const jwt_secret = process.env.JWT_SECRET_KEY;
// Registration User
exports.createUser = async (req, res) => {
  try {
    const { password, cpassword } = req.body;
    if (password.trim() != cpassword.trim()) {
      throw new Error("Password and confirm password not matched");
    }
    const hashPassword = await bcrypt.hash(password.trim(), 12);
    req.body.password = hashPassword;
    const user = new Users(req.body);
    const response = await user.save();
    res.status(201).json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const isExist = await Users.findOne({ mobile: mobile });
    if (!isExist) {
      throw new Error("User is not Exists");
    }
    const hashPassword = isExist.password;
    const isMatch = await bcrypt.compare(password, hashPassword);
    if (!isMatch) {
      throw new Error("Invalid password!");
    }
    const token = await jwt.sign({ isExist }, jwt_secret, {
      expiresIn: "300s",
    });
    // console.log(token);
    const storeJWT = await Users.updateOne(
      { mobile: mobile },
      { $set: { jwt: token } }
    );

    if(storeJWT.modifiedCount != 1){
        throw new Error("Token is not store");
    }
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.restrictedArea = async (req, res) => {
  res.json({ restricted: "accesss" });
};

// verify user
exports.userVerify = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (typeof authHeader === "undefined") {
      throw new Error("Token is invalid");
    }
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token is not found" });
    }
    // verify token
    const isVerify = jwt.verify(token, jwt_secret);
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

// User role Creation
exports.userRole = async (req, res) => {
    try{
        const authHeader = req.headers["authorization"];
        if (typeof authHeader === "undefined") {
            throw new Error("Token is invalid");
          }
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
        return res.status(401).json({ error: "Token is not found" });
        }
        const {role} = req.body;
        const roleUpdated = await Users.updateOne({jwt: token}, {$set: {role}});
        if(roleUpdated.modifiedCount != 1){
            throw new Error("Role is not updated");
        }
        res.status(200).json({success: "role is successfully updated"});

    }catch(err){
        res.status(401).json({error: err.message});
    }
}