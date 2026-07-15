const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const blogController = require("../controllers/blogController");
const upload = require("../configs/multerConfig");

//* Public Access
router.get("/all", blogController.getAllBlogs);

//* Users Access Only
router.post("/create", authMiddleware, upload.single("blogImage"), blogController.createBlog);
router.get("/my-blogs", authMiddleware, blogController.getMyBlogs);
router.post("/update/:id", authMiddleware, upload.single("blogImage"), blogController.updateBlog);
router.post("/delete/:id", authMiddleware, blogController.deleteBlog);

module.exports = router;