const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePicture: {
      type: String,
      default: "https://i.pinimg.com/736x/ce/30/61/ce3061daab82a47b57c38e8480aa0264.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
