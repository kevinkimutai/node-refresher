import express from "express";
const router = express.Router();

import {
  GETALLGIFTS,
  GETGIFT,
  DELETEGIFT,
  UPDATEGIFT,
  CREATEGIFT,
} from "../controllers/gift-controller.js";
import {
  AUTHPROTECTED,
  RESTRICTEDROUTE,
} from "../controllers/auth-controller.js";

router
  .route("/")
  .get(GETALLGIFTS)
  .post(AUTHPROTECTED, RESTRICTEDROUTE("admin"), CREATEGIFT);

router
  .route("/:id")
  .get(GETGIFT)
  .patch(AUTHPROTECTED, RESTRICTEDROUTE("admin"), UPDATEGIFT)
  .delete(AUTHPROTECTED, RESTRICTEDROUTE("admin"), DELETEGIFT);

export default router;
