import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/index.js';
import multer from 'multer';
import fs from 'fs';

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name as string,
  api_key: config.cloudinary_api_key as string,
  api_secret: config.cloudinary_api_secret as string,
});

export const sendImageToCloudinary = (
  imageName: string,
  path: string
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      { public_id: imageName },
      (error, result) => {
        if (error) {
          console.log(error);
          reject(error);
        } else if (result) {
          resolve(result); // ✅ result is not undefined here
        } else {
          reject(new Error('No result returned from Cloudinary'));
        }

        // delete the local file after upload
        fs.unlink(path, (err) => {
          if (err) console.error(err);
          else console.log('🗑️ File deleted');
        });
      }
    );
  });
};

// Configure where to save and what to name the files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + '/uploads/'); // folder name where files will be stored
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName); // unique file name
  },
});

// Create the upload middleware
export const upload = multer({ storage });
