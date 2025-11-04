import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: String,
  title: String,
  completed: Boolean,
});

export default mongoose.models.Task || mongoose.model("Task", taskSchema)

