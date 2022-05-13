import express from "express";
import "./utils/conncetDB.js";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import dashboardRoute from "./routes/dashboard.route.js";
import friendRoute from "./routes/friend.route.js";
import { connectSocketServer } from "./socket/socketServer.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/friend", friendRoute);

const server = http.createServer(app);
const io = connectSocketServer(server);
export const getIoInstance = io;

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("starting..."));
