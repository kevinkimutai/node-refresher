import express from "express";
import { SIGNUP, LOGIN } from "../controllers/auth-controller.js";

const router = express.Router();

router.route("/signup").post(SIGNUP);
router.route("/login").post(LOGIN);

export default router;
