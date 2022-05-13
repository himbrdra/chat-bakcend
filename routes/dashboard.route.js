import express from "express";
import { isLogin } from "../middlewares/index.js";

const route = express.Router();

route.get("/", isLogin, (req, res) => {
  res.status(200).send("hello");
});

export default route;
