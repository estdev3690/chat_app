import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    online: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 43200, // 12 hours in seconds
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
