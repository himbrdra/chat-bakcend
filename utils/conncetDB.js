import mongoose from "mongoose";
import keys from "../config/keys.js";

mongoose.connect(keys.dbURL, () => console.log("connected"));
