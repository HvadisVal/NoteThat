import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  status: { type: String, enum: ['todo', 'inProgress', 'done'], required: true },
  color: { type: String, default: 'bg-blue-500' },
  deadline: { type: String },
  avatar: { type: String },
});

export const TaskModel = mongoose.model('Task', TaskSchema);
