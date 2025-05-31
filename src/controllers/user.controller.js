import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import { healthcheck } from "../controllers/healthcheck.controller.js";

const registerUser = asyncHandler(async (req, res) => {
  // getting values from User model
  const { fullname, email, password, username } = req.body;

  //validation
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required!");
  }

  //Checking whether user exist
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new apiError(400, "User already exist!");
  }

  //   checking whether avatar and cover is their
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar is missing!");
  }

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Uploaded avatar", avatar);
  } catch (error) {
    console.log("Error uploading avatar", error);
    throw new apiError(500, "Failed to upload avatar");
  }

  if (!coverLocalPath) {
    throw new apiError(400, "Avatar is missing!");
  }

  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(coverLocalPath);
    console.log("Uploaded cover image", coverImage);
  } catch (error) {
    console.log("Error uploading cover image", error);
    throw new apiError(500, "Failed to upload cover image");
  }

  //   Constructing user
  try {
    const user = await User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage.url,
      email,
      username: username.toLowerCase(),
      password,
    });

    //   checking whether getting from the database,select is used to neglect certain fields like password and token here
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    //   500 for server error and checking whether user is created or not
    if (!createdUser) {
      throw new apiError(500, "Something went wrong while registering user ");
    }

    return res
      .status(201)
      .json(new apiResponse(200, createdUser, "User registered successfully!"));
  } catch (error) {
    console.log("Error creating user", error);

    // Deleting images from cloudinary if user is not their
    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }
    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id);
    }

    throw new apiError(
      500,
      "Something went wrong while registering a user and images were deleted"
    );
  }
});

export { registerUser };
