"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TaskSchema = new mongoose_1.default.Schema({
    text: { type: String, required: true },
    status: { type: String, enum: ['todo', 'inProgress', 'done'], required: true },
    color: { type: String, default: 'bg-blue-500' },
    deadline: { type: String },
    avatar: { type: String },
});
exports.TaskModel = mongoose_1.default.model('Task', TaskSchema);
