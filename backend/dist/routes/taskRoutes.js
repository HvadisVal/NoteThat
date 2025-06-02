"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
router.get('/', authMiddleware_1.default, taskController_1.getTasks);
router.post('/', authMiddleware_1.default, taskController_1.createTask);
router.put('/:id', authMiddleware_1.default, taskController_1.updateTask);
//router.delete('/:id', authMiddleware, deleteTask);
exports.default = router;
