import { University, User, Bank } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const Register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const ExistingUser = await User.findOne({ email });
    if (ExistingUser) {
      return res
        .status(400)
        .json({ message: "user already registered...try login.." });
    }

    const user = new User({ name, email, password });
    await user.save();
    res
      .status(201)
      .json({ message: "user successfully registered.....", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error in registering ...try again..", error });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ message: "no user found...try registering.." });
    }
    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {
      return res.status(400).json({ message: "invalid credentials.." });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res
      .status(200)
      .json({ message: " successfully login.....", user, token: token });
  } catch (error) {
    res.status(500).json({ message: "error in login ...try again..", error });
  }
};

export const Logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "logged out successfully",
      });
  } catch {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const Adduniversity = async (req, res) => {
  const { name } = req.body;
  const Uni = await University.findOne({ name });
  if (Uni) {
    return res
      .status(400)
      .json({ message: "university already exist...try different.." });
  }

  try {
    const university = new University({ name });
    await university.save();
    res.status(200).json({message: "added suceesfully", name})
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const getUni = async (req, res) => {
  try {
    const universities = await University.find();

    res.status(200).json({
      success: true,
      data: universities,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const AddBank = async (req, res) => {
  const { name } = req.body;
  const bk = await Bank.findOne({ name });
  if (bk) {
    return res.status(400).json({ message: "bank already exist" });
  }
  try {
    const bank = new Bank({ name });
    await bank.save();
    res.status(200).json({ message: "Bank added successfully", bank });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const getBank = async (req, res) => {
  try {
    const banks = await Bank.find();

    res.status(200).json({
      success: true,
      data: banks,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const AddUniversitiesandbanks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { universityId, BanksIDs } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const universityExists = user.universities.some(
      (university) => university.universityId.toString() === universityId
    );
    
    if (universityExists) {
      return res.status(400).json({ message: "University already linked to this user" });
    }

    const validbanks = await Bank.find({ _id: { $in: BanksIDs } });
    if (validbanks.length !== BanksIDs.length) {
      return res.status(404).json({ message: "One or more banks not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          universities: {
            universityId,
            banks: BanksIDs,
          },
        },
      },
      { new: true }
    )
      .populate({
        path: "universities.universityId",
        select: "name",
      })
      .populate({
        path: "universities.banks",
        select: "name",
      });

    if (!updatedUser) {
      return res.status(404).json({ message: "Failed to update user" });
    }

    res.status(200).json({
      message: "Universities and banks added and linked successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getUserData = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate({
        path: "universities.universityId",
        select: "name",
      })
      .populate({
        path: "universities.banks",
        select: "name",
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User data fetched successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
