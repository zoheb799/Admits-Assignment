import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: [true, "Please enter an email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    select: false,
  },
  universities: [
    {
      universityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "University",
        required: true,
      },
      banks: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Bank",
        },
      ],
    },
  ],
});

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const bankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = mongoose.model("User", userSchema);
export const University = mongoose.model("University", universitySchema);
export const Bank = mongoose.model("Bank", bankSchema);
