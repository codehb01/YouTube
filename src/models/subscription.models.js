import mongoose, { Schema } from "mongoose";
const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, //One who is subscribing
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId, //the one who's channel is getting subscribed
      ref: "User",
    },
  },
  { timestamps: true }
);
export const Subscription = mongoose.model("Subscription", subscriptionSchema);

// id string pk
// subscriber ObjectId users
// channel ObjectId users
// createdAt Date
// updatedAt Date
