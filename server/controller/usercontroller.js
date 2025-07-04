import 'dotenv/config';
import User from '../model/usermodel.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'sahil@1234';
const TOKEN_EXPIRES = '12h';

const createToken = (userId) => {
 return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES })
}

//register a user
export async function registerUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false, message: "All fields are required"
    })
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false, message: "Invalid email"
    })
  }
  if (password.length < 8) {
    return res.status(400).json({
      success: false, message: "Password must be atleast 8 characters"
    })
  }

  try {
    if (await User.findOne({ email })) {
      return res.status(409).json({
        success: false, message: "User already exists"
      })
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = createToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    })
  }
  catch (err) {
    console.log(err)
   return res.status(500).json({
      success: false,
      message: "Server error"

    })
  }
}

//login user 
export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false, message: "Email and Password are required"
    })
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false, message: "Invalid Credentials."
      })
    }
    const match = await bcrypt.compare(password, user.password); //encrypt password and compare

    if (!match) {
      return res.status(401).json({
        success: false, message: "Invalid Credentials."
      })
    }

    const token = createToken(user._id);

   return res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
      message:"LoggedIn"
    })
  } catch (err) {
    console.log(err)
   return res.status(500).json({
      success: false,
      message: "Server error"

    })
  }
}

//get current user

export async function getCurrentUser(req, res) {

  try {

    const user = await User.findById(req.user.id).select("name email");

    if (!user) {
      return res.status(400).json({
        success: false, message: "User not found"
      })
    }
  return  res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    console.log(error)
   return res.status(500).json({
      success: false,
      message: "Server error"

    })
  }

}

//Update user
export async function updateUser(req, res) {

  const { name, email } = req.body;
  if (!name || !email || !validator.isEmail(email)) {
    return res.status(400).json({
      success: false, message: "Valid name and email required"
    })
  }
  try {
    const exists = await User.findOne({ email, _id: { $ne: req.user.id } });

    if (exists) {
      return res.status(409).json({
        success: false, message: "Email already in use by another account"
      })
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true, select: "name email" }
    );

    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"

    })
  }
}

//change password
export async function updatePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({
      success: false, message: "Password invalid"
    })
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false, message: "User not found"
      })
    }
    const match = await bcrypt.compare(currentPassword,user.password);
    if(!match){
      return res.status(401).json({
      success: false, message: "Current password incorrect"
    })
    }
    user.password = await bcrypt.hash(newPassword,10);
    user.save(); 
     res.status(200).json({
      success: true,
      message:"Password Changed"
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"

    })
  }
}