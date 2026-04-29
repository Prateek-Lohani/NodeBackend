const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

const BACKEND_SECRETKEY = process.env.BACKEND_SECRETKEY;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
      min: 18,
    },
    pfp: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, BACKEND_SECRETKEY, {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validateUser = async function (password) {
  const user = this;
  const validUser = await bcrypt.compare(password, user.password);

  return validUser;
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
