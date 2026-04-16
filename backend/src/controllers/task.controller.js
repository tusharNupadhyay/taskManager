import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const validateId = (id) => {
  if (!id) throw new ApiError(400, "Id is missing");
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ApiError(400, "Invalid ID");
  return new mongoose.Types.ObjectId(id);
};

const createTask = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  if (!title?.trim() || !description?.trim()) {
    throw new ApiError(400, "Title and description are required");
  }

  const task = await Task.create({
    title: title.trim(),
    description: description.trim(),
    category,
    owner: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

const getUserTasks = asyncHandler(async (req, res) => {
  //admin override
  const tasks =
    req.user?.role === "admin"
      ? await Task.find()
      : await Task.find({ owner: req.user?._id });

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const taskId = validateId(req.params.taskId);
  const { title, description, completed, category } = req.body;

  const task = await Task.findById(taskId);

  if (!task) throw new ApiError(404, "Task not found");

  // ownership check
  if (
    req.user.role !== "admin" &&
    task.owner.toString() !== req.user?._id.toString()
  ) {
    throw new ApiError(403, "Not authorized");
  }

  task.title = title ?? task.title;
  task.description = description ?? task.description;
  task.completed = completed ?? task.completed;
  task.category = category ?? task.category;

  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const taskId = validateId(req.params.taskId);

  const task = await Task.findById(taskId);

  if (!task) throw new ApiError(404, "Task not found");

  if (
    req.user.role !== "admin" &&
    task.owner.toString() !== req.user?._id.toString()
  ) {
    throw new ApiError(403, "Not authorized");
  }

  await task.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

export { createTask, updateTask, deleteTask, getUserTasks };
