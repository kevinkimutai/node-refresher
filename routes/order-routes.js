import express from "express";
const router = express.Router();

import {
  GETALLORDERS,
  GETORDER,
  DELETEORDER,
  UPDATEORDER,
  CREATEORDER,
} from "../controllers/order-controller.js";
import {
  AUTHPROTECTED,
  RESTRICTEDROUTE,
} from "../controllers/auth-controller.js";

router
  .route("/")
  .get(AUTHPROTECTED, RESTRICTEDROUTE("admin"), GETALLORDERS)
  .post(AUTHPROTECTED, RESTRICTEDROUTE("user"), CREATEORDER);

router
  .route("/:id")
  .get(AUTHPROTECTED, GETORDER)
  .patch(AUTHPROTECTED, RESTRICTEDROUTE("admin"), UPDATEORDER)
  .delete(AUTHPROTECTED, RESTRICTEDROUTE("admin"), DELETEORDER);

export default router;
