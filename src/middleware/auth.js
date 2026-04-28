const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const BACKEND_SECRETKEY = process.env.BACKEND_SECRETKEY;

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("TOken Expired. Login Again.");
    }

    const decodedObj = await jwt.verify(token, BACKEND_SECRETKEY);

    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User Not Found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error occured " + err);
  }
};

module.exports = { userAuth };
