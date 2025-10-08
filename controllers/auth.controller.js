import { text } from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/auth.middleware.js";

// import bcrypt from "bcryptjs";
export const registerController = async (req, res) => {
  try {
    // console.log(req.body);
    // console.log(req.query);
    // console.log(req.params);

    // validation

    // kiem tra xem co chua?
    const username = req.body;
    const checkUserExist = await User.findOne({ username });
    if (!checkUserExist) {
      return res.status(400).json({
        message: 'Username da ton tai',
        success: false
      })
    }
    // tao user
    // console.log(req.body.password);
    // const {username,email} = req.body;
    req.body.password = await bcrypt.hash(req.body.password, 10);
    // console.log(hashPass);
    const user = await User.create(req.body);
    // console.log(user);
    
    if (!user) {
      return res.status(400).json({
        message: "khong the dang ky tai khoan, vui long kiem tra lai",
        success: false,
      });
    }

    user.password = undefined;
    return res.status(400).json({
      message: "dang ky thanh cong",
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const loginController = async (req, res) => {
  try {
    // console.log(req.body);
    const { username, password } = req.body;
    const checkUserExist = await User.findOne({ username });

    const isMatch = await bcrypt.compare(password, checkUserExist.password);

    // console.log(isMatch);
    if (!checkUserExist) {
      return res.status(400).json({
        message: 'Username k ton tai',
        success: false
      })
    }
    if (!isMatch) {
      return res.status(400).json({
        message: 'Mat khau k dung',
        success: false
      })
    }
    const token = jwt.sign({ id: checkUserExist._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(201).json({
      message: 'Dang nhap thanh cong',
      token: token
    })
  } catch (error) {
    console.log(error);
  }
};

export const getMe = async ( req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy user với token này"
      })
    }
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};
