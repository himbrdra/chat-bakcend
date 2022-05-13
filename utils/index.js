import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import keys from "../config/keys.js";

export const encryptPwd = async (pwd) => await bcrypt.hash(pwd, 12);

export const comparePwd = async (planePwd, hashedPwd) => {
  return await bcrypt.compare(planePwd, hashedPwd);
};

export const generateToken = (uid) => jwt.sign({ id: uid }, keys.tokenKey);
export const virfeyToken = (token) => jwt.verify(token, keys.tokenKey);
