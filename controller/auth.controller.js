import {
  encryptPwd,
  comparePwd,
  generateToken,
  virfeyToken,
} from "../utils/index.js";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  const { email, username, password } = req.body;

  const existEmail = await User.findOne({ email });
  if (existEmail)
    return res.status(409).send({ error: "this email is already exist" });

  try {
    const hashedPwd = await encryptPwd(password);
    let user = await User.create({ email, username, password: hashedPwd });
    const token = generateToken(user.id);
    let response = {
      username: user.username,
      token,
      _id: user._id,
    };
    res.status(201).send(response);
  } catch (error) {
    res.send(error);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    const isCorrectPwd = await comparePwd(password, user.password);
    if (isCorrectPwd) {
      const token = generateToken(user.id);
      let response = {
        username: user.username,
        token,
        _id: user._id,
      };
      res.status(200).send(response);
    } else {
      res.status(403).send({ error: "wrong password" });
    }
  } else {
    res.status(403).send({ error: "this email is not exist" });
  }
};
