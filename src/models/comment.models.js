import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const commentSchema = new Schema(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
commentSchema.plugin(mongooseAggregatePaginate);
export const Comment = mongoose.model("Comment", commentSchema);

// Why use this?
// - Helps in fetching only a portion of data (e.g., 10 records) instead of the entire collection
// - Prevents loading thousands of documents at once

// Benefits:
// - Improves app response time and performance
// - Reduces memory usage and server load
// - Provides a smoother user experience with faster loading lists

// Real-world use:
// - Used in apps with large datasets like comments, products, orders, users, etc.
// - Common in social media, e-commerce, and admin dashboards

// Example usage:
// Comment.aggregate([{ $match: { postId: id } }])
//   .paginate({ page: 1, limit: 10 });