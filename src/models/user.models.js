import mongoose, { Schema } from "mongoose";

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

// creating a new model/document/structure in database and schema/structure followed is userSchema
// exporting for querying and using
export const User = mongoose.model("User", userSchema);
