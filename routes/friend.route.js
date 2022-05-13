import express from "express";
import {
  acceptInvitaion,
  sendInvitaion,
  rejectInvitaion,
} from "../controller/freind.controller.js";
import { isLogin } from "../middlewares/index.js";
const route = express.Router();

route.post("/invitaion", isLogin, sendInvitaion);
route.post("/accept", isLogin, acceptInvitaion);
route.post("/reject", isLogin, rejectInvitaion);

export default route;
