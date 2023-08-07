import express from "express";
import {
  GETALLREVIEWS,
  GETREVIEW,
  DELETEREVIEW,
  UPDATEREVIEW,
  CREATEREVIEW,
} from "../controllers/review-controller.js";
import {
  AUTHPROTECTED,
  RESTRICTEDROUTE,
} from "../controllers/auth-controller.js";

const router = express.Router({ mergeParams: true });

// NOTE: ALL THIS ROUTES ARE HANDLED
//tour/tourId/reviews
//reviews/

router
  .route("/")
  .get(AUTHPROTECTED, RESTRICTEDROUTE("user", "admin"), GETALLREVIEWS)
  .post(AUTHPROTECTED, RESTRICTEDROUTE("user"), CREATEREVIEW);

router
  .route("/:id")
  .get(AUTHPROTECTED, GETREVIEW)
  .patch(AUTHPROTECTED, RESTRICTEDROUTE("admin"), UPDATEREVIEW)
  .delete(AUTHPROTECTED, RESTRICTEDROUTE("admin"), DELETEREVIEW);

export default router;
