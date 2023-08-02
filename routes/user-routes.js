import express from "express";
import {
  DELETEUSER,
  GETALLUSERS,
  GETUSER,
  UPDATEME,
  UPDATEUSER,
} from "../controllers/user-controller.js";
import {
  AUTHPROTECTED,
  RESTRICTEDROUTE,
} from "../controllers/auth-controller.js";

const router = express.Router();

router.route("/update-me").patch(AUTHPROTECTED, UPDATEME);
router.route("/").get(AUTHPROTECTED, RESTRICTEDROUTE(["admin"]), GETALLUSERS);
router
  .route("/:id")
  .get(AUTHPROTECTED, RESTRICTEDROUTE(["admin"]), GETUSER)
  .patch(AUTHPROTECTED, RESTRICTEDROUTE(["admin"]), UPDATEUSER)
  .delete(AUTHPROTECTED, RESTRICTEDROUTE(["admin"]), DELETEUSER);

export default router;
