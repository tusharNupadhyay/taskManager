import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const validateId = (id) => {
  if (!id) throw new ApiError(400, "Id is missing");
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ApiError(400, "Invalid ID");
  return new mongoose.Types.ObjectId(id);
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body || {};

  if ([username, email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  //check if user already exists or not
  const existedUser = await User.findOne({
    $or: [
      { username: username.trim().toLowerCase() },
      { email: email.trim().toLowerCase() },
    ],
  });
  if (existedUser)
    throw new ApiError(409, "User with email or username already exists");

  const user = await User.create({
    username: username.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser)
    throw new ApiError(500, "something went wrong while registering user");

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "user registered successfully"));
});

const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    return user.generateAccessToken();
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating access token"
    );
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body || {};

  // or if(!(username || email))
  if (!identifier?.trim() || !password?.trim())
    throw new ApiError(400, "All fields are  required");

  const normalizedIdentifier = identifier.trim().toLowerCase();

  const user = await User.findOne({
    $or: [{ username: normalizedIdentifier }, { email: normalizedIdentifier }],
  }).select("+password"); // because we have added select false in password in user model

  if (!user) throw new ApiError(401, "user does not exist");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "invalid credentials");

  const accessToken = await generateAccessToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password");

  //   const options = {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: "None",
  //     path: "/",
  //     partitioned: true,
  //   };
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options) //creates cookie in user's browerser's storage
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "user logged in successfully"
      )
    );
});

export { registerUser, loginUser };
