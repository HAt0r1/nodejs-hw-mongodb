import cloudinary from 'cloudinary';
import { env } from './env.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: env('CLOUDINARY_CLOUD_NAME'),
  api_key: env('CLOUDINARY_API_KEY'),
  api_secret: env('CLOUDINARY_API_SECRET'),
});

const setFileToCloudinary = async (file) => {
  const responce = await cloudinary.v2.uploader.upload(file.path);
  return responce.secure_url;
};

export default setFileToCloudinary;
