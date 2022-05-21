import express from "express";
import "./utils/conncetDB.js";
import cors from "cors";
import http from "http";
import "dotenv/config";
import authRoute from "./routes/auth.route.js";
import dashboardRoute from "./routes/dashboard.route.js";
import friendRoute from "./routes/friend.route.js";
import userRoute from "./routes/user.route.js";
import { connectSocketServer } from "./socket/socketServer.js";

import formData from "express-form-data";
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(formData.parse());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/friend", friendRoute);
app.use("/api/v1/user", userRoute);

const server = http.createServer(app);
const io = connectSocketServer(server);
export const getIoInstance = io;

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("starting..."));
