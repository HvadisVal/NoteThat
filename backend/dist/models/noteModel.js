"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteModel = void 0;
const mongoose_1 = require("mongoose");
const collaboratorSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    avatar: { type: String } // optional
}, { _id: false } // prevents Mongoose from adding an unnecessary _id to each collaborator
);
const noteSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    color: { type: String, required: true },
    tags: [{ type: String }],
    pinned: { type: Boolean, default: false },
    userId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    collaborators: {
        type: [collaboratorSchema], // ✅ define schema here
        default: undefined
    }
});
exports.NoteModel = (0, mongoose_1.model)('Note', noteSchema);
