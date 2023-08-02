import express from "express";
import {
  SIGNUP,
  LOGIN,
  FORGOTPASSWORD,
  RESETPASSWORD,
} from "../controllers/auth-controller.js";

const router = express.Router();

router.route("/signup").post(SIGNUP);
router.route("/login").post(LOGIN);
router.route("/forgot-password").post(FORGOTPASSWORD);
//router.route("/reset-password").post(RESETPASSWORD);
router.route("/reset-password/:token").post(RESETPASSWORD);

export default router;
