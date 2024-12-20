import express from "express";
import { 
  AddBank, 
  AddUniversitiesandbanks, 
  Adduniversity, 
  getBank, 
  getUni, 
  getUserData, 
  Login, 
  Logout, 
  Register 
} from "../controllers/controller.js";
import { authMiddleware } from "../middlewares/auth.js";

 export const UserRouter = express.Router();

UserRouter.route("/").get((req, res) => {
  res.json({
    message: "port running !!!!",
  });
});

UserRouter.route("/login").post(Login);
UserRouter.route("/register").post(Register);
UserRouter.route("/logout").post(authMiddleware, Logout);
UserRouter.route("/getunis").get(getUni);
UserRouter.route("/getbanks").get(getBank);
UserRouter.route("/linkunibanks").post(authMiddleware, AddUniversitiesandbanks);
UserRouter.route("/addbank").post(authMiddleware, AddBank);
UserRouter.route("/adduni").post(authMiddleware, Adduniversity);
UserRouter.route("/userprofile").get(authMiddleware, getUserData);

