import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 900, // Token expires after 15 minutes
  },
});

const PasswordReset = mongoose.model("PasswordReset", passwordResetSchema);
export default PasswordReset;
