import cloudinary, { UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME ?? "",
  api_key: process.env.CLOUDINARY_API_KEY ?? "",
  api_secret: process.env.CLOUDINARY_API_SECRET ?? "",
});

export const uploadImage = (imageBuffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: "profiles" },
      (error: any, result: UploadApiResponse | undefined) => {
        if (error) {
          console.log(error, "ths is the error");
        }
        if (error || !result) {
          return reject(new Error("Failed to upload image"));
        }

        resolve(result.secure_url);
      }
    );

    uploadStream.end(imageBuffer);
  });
};

export default uploadImage;
