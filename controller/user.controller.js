import cloudinary from "cloudinary";
import User from "../models/User.js";

cloudinary.v2.config({
  cloud_name: "df2hfgvhq",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadProfileImage = async (req, res) => {
  console.log(req.files.image.path);
  try {
    console.log(req.user);
    const uploadedImage = await cloudinary.v2.uploader.upload(
      req.files.image.path
    );
    req.user.image = uploadedImage.secure_url;
    req.user.save();

    return res.status(201).send({
      secure_url: uploadedImage.secure_url,
    });
  } catch (error) {
    console.log("error", error);
  }
};
