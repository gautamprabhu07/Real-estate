import express from "express";
import {verifyToken} from "../middleware/verifyToken.js";
import { validate } from "../middleware/validate.js";
import { addPostSchema, updatePostSchema } from "../lib/validators.js";
import { addPost, deletePost, getPost, getPosts, updatePost } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", verifyToken, validate(addPostSchema), addPost);
router.put("/:id", verifyToken, validate(updatePostSchema), updatePost);
router.delete("/:id", verifyToken, deletePost);

export default router;