const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database");
const app = express();
const PORT = process.env.PORT;
const BACKEND_SECRETKEY = process.env.BACKEND_SECRETKEY;
const User = require("./models/user");
const { signupValidation } = require("./utils/signupValidator");
const cookieParser = require("cookie-parser");

const bcrypt = require("bcrypt");
const { userAuth } = require("./middleware/auth");

app.use(express.json());
app.use(cookieParser());

const pick = (obj, allowedFields) =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) => allowedFields.includes(key)),
  );

app.post("/signup", async (req, res) => {
  try {
    signupValidation(req);

    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).send("User Added Successfully");
  } catch (e) {
    res.status(500).send(`Error creating user: ` + e.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invaid Credentials");
    }

    const validUser = user.validateUser(password);

    if (validUser) {
      const token = await user.getJWT();

      res.cookie("token", token);
      res.send("Login Successfully");
    } else {
      res.send("Invaid Credentials");
    }
  } catch (error) {
    res.status(500).send(`Error Login user: ` + error.message);
  }
});

app.get("/getLoggedInProfile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send({
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      pfp: user.pfp,
    });
  } catch (error) {
    res.status(500).send(`Error Getting Logged In user: ` + e.message);
  }
});

app.post("/addUser", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send("User Added Successfully");
  } catch (e) {
    res.status(500).send(`Error creating user: ` + e.message);
  }
});

app.get("/getAllUsers", userAuth, async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.send("No Users");
    } else {
      res.send(
        users.map((userDetails) => {
          return {
            _id: userDetails.id,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            pfp: userDetails.pfp,
          };
        }),
      );
    }
  } catch (e) {
    res.status(500).send(`Error fetching user: ` + e.message);
  }
});

app.post("/getUserDetailsByEmail", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const userData = await User.findOne({ email: userEmail });
    if (!userData) {
      res.status(200).send(`No user found for the email ${userEmail}`);
    } else {
      res.status(200).send({
        _id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        pfp: userData.pfp,
      });
    }
  } catch (e) {
    res.status(500).send(`Error getting user: ` + e.message);
  }
});

app.delete("/deleteUserByEmail", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const userData = await User.deleteOne({ email: userEmail });
    if (userData.deletedCount === 0) {
      res.status(200).send(`No user found for the email ${userEmail}`);
    } else {
      res.status(200).send("User Deleted Successfully");
    }
  } catch (e) {
    res.status(500).send(`Error Deleting user: ` + e.message);
  }
});

app.patch("/updateUserDetailsByEmail", async (req, res) => {
  const { email, ...rest } = req.body;
  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    const allowedFields = ["firstName", "lastName", "age", "pfp"];
    const updateData = pick(rest, allowedFields);

    const userDetail = await User.updateOne({ email: email }, updateData);

    if (userDetail.modifiedCount === 0) {
      res.status(200).send(`No user found for the email ${email}`);
    } else {
      res.status(200).send("User Updated Successfully");
    }
  } catch (error) {
    res.status(500).send(`Error updating user: ` + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to DB Successfully");
    app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));
  })
  .catch((error) => console.log("Error Starting Server" + error));
