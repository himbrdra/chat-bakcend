import express from "express";

const router = express.Router();
import { uploadProfileImage } from "../controller/user.controller.js";
import { isLogin } from "../middlewares/index.js";

router.post("/profile-image", isLogin, uploadProfileImage);

export default router;
