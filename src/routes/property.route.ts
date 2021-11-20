import express from "express";
import {
  deletePropertyAd,
  getAllPropertyAd,
  propertyAd,
  viewSpecificAdvert,
  markPropertyAsSold,
  updateAd,
} from "../controller/property.controller";
import { verifyUser } from "../middleware/Authentication";
import upload from "../utils/multer";

const propertyRouter = express();

propertyRouter
  .route("/")
  .post(verifyUser, upload.single("image_url"), propertyAd);
propertyRouter.route("/").get(getAllPropertyAd);
propertyRouter.route("/:id").get(viewSpecificAdvert);
propertyRouter.route("/:propertyid").delete(verifyUser, deletePropertyAd);
propertyRouter.route("/:propertyid").patch(verifyUser, markPropertyAsSold);
propertyRouter
  .route("/:propertyid/update")
  .patch(verifyUser, upload.single("image_url"), updateAd);

export default propertyRouter;
