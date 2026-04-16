import { Router } from "express";
import {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// protected routes
router.route("/").post(verifyJWT, createTask).get(verifyJWT, getUserTasks);

router.route("/:taskId").put(verifyJWT, updateTask).delete(verifyJWT, deleteTask);

export default router;
