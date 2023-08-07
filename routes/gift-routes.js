import express from "express";

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

import reviewRouter from "./review-routes.js";

const router = express.Router();

//NESTED REVIEWS MIDDLEWARE
router.use("/:giftId/reviews", reviewRouter);

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
