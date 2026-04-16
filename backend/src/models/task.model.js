import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema({
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    category: {
      type: String,
      enum: ["work", "personal"],
      default: "personal",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  { timestamps: true });

  taskSchema.index({ owner: 1 });

export const Task = mongoose.model("Task", taskSchema);