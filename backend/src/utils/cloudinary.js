const cloudinary = require('cloudinary').v2;
const config = require('../configs/config');

const cloudinaryConfig = {
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
}

cloudinary.config(cloudinaryConfig);

module.exports = cloudinary;