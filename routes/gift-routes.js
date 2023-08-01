import express from "express";
const router = express.Router();

import {
  GETALLGIFTS,
  GETGIFT,
  DELETEGIFT,
  UPDATEGIFT,
  CREATEGIFT,
} from "../controllers/gift-controller.js";
import { AUTHPROTECTED } from "../controllers/auth-controller.js";

router.route("/").get(GETALLGIFTS).post(CREATEGIFT);

router
  .route("/:id")
  .get(AUTHPROTECTED, GETGIFT)
  .patch(UPDATEGIFT)
  .delete(DELETEGIFT);

export default router;
