import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const isLogin = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (token) {
    try {
      const userId = jwt.verify(token, process.env.SECRET_KEY);

      const user = await User.findById(userId.id);
      req.user = user;

      // req.user = userId;
      next();
    } catch (err) {
      console.log(err);
      res.status(401).send("unAuthorized request");
    }
  } else {
    res.status(403).send("no token was found");
  }
};

export const socketAuth = (socket, next) => {
  const token = socket.handshake.auth?.token;
  try {
    const user = jwt.verify(token, process.env.SECRET_KEY);
    socket.user = user;
    next();
  } catch (error) {
    next(new Error(error));
  }
};
