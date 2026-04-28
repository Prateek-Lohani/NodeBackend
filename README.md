# Node Backend API Documentation

## Base URL
```
http://localhost:PORT
```
*(Replace PORT with your environment variable, default typically 3000/5000)*

## User Schema
```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String,
  age: Number (min: 18),
  pfp: String (default: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg')
}
```
*Timestamps: `createdAt`, `updatedAt` automatically added*

## API Endpoints

### 0. User Login 
```
POST /login (JWT Authentication + Cookie Parser)
```
**Description:** Logs In registered user

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123",
  
}
```

**Response:**
- **201**: `"Login Successful"`
- **500**: Error message

### 1. User Signup 
```
POST /signup
```
**Description:** Create new user with validation

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@example.com",
  "password": "securepassword123",
  "age": 25,
  "pfp": "https://example.com/avatar.jpg"
}
```

**Response:**
- **201**: `"User Added Successfully"`
- **500**: Error message

### 2. Add User (No Validation)
```
POST /addUser
```
**Description:** Create user without validation

**Request Body:** Same as signup

**Response:** Same as signup

### 3. Get All Users
```
GET /getAllUsers  [Protected]
```
**Description:** Fetch all users

**Response:**
- **200**: Array of users `[{...}, {...}]`
- `"No Users"` if empty
- **500**: Error

### 4. Get User by Email
```
POST /getUserDetailsByEmail
```
**Description:** Find user by email

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response:**
- **200**: User object or `"No user found for the email..."`

### 5. Delete User by Email
```
DELETE /deleteUserByEmail
```
**Description:** Delete user by email

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response:**
- **200**: `"User Deleted Successfully"` or `"No user found..."`

### 6. Update User by Email
```
PATCH /updateUserDetailsByEmail
```
**Description:** Update user details (partial update)

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "firstName": "Johnny",
  "age": 26
}
```
*Allowed fields: `firstName`, `lastName`, `age`, `pfp`*

**Response:**
- **200**: `"User Updated Successfully"` or `"No user found..."`
- **400**: `"Email is required"`

### 7. Get Logged In User Details
```
GET /getLoggedInProfile  [Protected]
```
**Description:** Find LoggedIn user 


**Response:**
- **200**: User object or `"Error Getting Logged In user..."`


## Running the API
1. `npm install`
2. Set `.env` with `PORT`,`BACKEND_SECRETKEY` and MongoDB `MONGODB_URI`
3. `npm run local` 

## Password Security (bcrypt)

**bcrypt v6.0.0** is installed.

### Issue
Passwords stored as plain text ❌

###  Implementation
```javascript
const bcrypt = require('bcrypt');
const saltRounds = 12;

// In /signup endpoint, BEFORE saving:
const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
req.body.password = hashedPassword;
const user = new User(req.body);
await user.save();
```

### Comparision of Password
```javascript
const bcrypt = require('bcrypt');

// In /login endpoint:
const { email, password } = req.body;

const user=await User.findOne({email:email});  // finding userobj with the email
const isMatchedPassword = await bcrypt.compare(req.body.password, user.password);
```

## Notes
- Implement bcrypt for hashing
- Signup includes validation (via `signupValidator.js`)
- All endpoints include error handling
- Uses MongoDB with Mongoose ODM

---
