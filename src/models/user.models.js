import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    // mongo auto adds unique id
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //url
      required: true,
    },
    coverImage: {
      type: String, //url
      required: true,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true } //directly generates createdAt and updatedAt
);
// Schema hook(middleware)
// Using pre hook here ,these middlewares requires next everytime ,next is used to pass request to each middleware

// hashing password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); //exiting if password not modified
  this.password = await bcrypt.hash(this.password, 10); //hashes users password and 10 is salt/noOfround hashing will be performed
  next();
});

// comparing entered  and hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// ACCESS TOKEN LOGIC
userSchema.methods.generateAccessToken = function () {
  // short lived access jwt
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// REFRESH TOKEN LOGIC 
userSchema.methods.generateRefreshToken = function () {
  // short lived access jwt
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

// creating a new model/document/structure in database and schema/structure followed is userSchema
// exporting for querying and using
export const User = mongoose.model("User", userSchema);
