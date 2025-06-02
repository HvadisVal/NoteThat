"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotes = getNotes;
exports.createNote = createNote;
exports.updateNote = updateNote;
exports.deleteNote = deleteNote;
const noteModel_1 = require("../models/noteModel");
const database_1 = require("../repository/database");
/**
 * Get all notes for the logged-in user
 */
function getNotes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            yield (0, database_1.connect)();
            const notes = yield noteModel_1.NoteModel.find({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
            res.status(200).json(notes);
        }
        catch (error) {
            res.status(500).send("Failed to fetch notes: " + error);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Create a new note
 */
function createNote(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            yield (0, database_1.connect)();
            const note = new noteModel_1.NoteModel(Object.assign(Object.assign({}, req.body), { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, timestamp: new Date() }));
            const savedNote = yield note.save();
            res.status(201).json(savedNote);
        }
        catch (error) {
            res.status(500).send("Failed to create note: " + error);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Update a note
 */
function updateNote(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            yield (0, database_1.connect)();
            const updated = yield noteModel_1.NoteModel.findOneAndUpdate({ _id: req.params.id, userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }, req.body, { new: true });
            if (!updated) {
                res.status(404).send("Note not found");
                return;
            }
            res.status(200).json(updated);
        }
        catch (error) {
            res.status(500).send("Failed to update note: " + error);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Delete a note
 */
function deleteNote(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            yield (0, database_1.connect)();
            const deleted = yield noteModel_1.NoteModel.findOneAndDelete({
                _id: req.params.id,
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
            });
            if (!deleted) {
                res.status(404).send("Note not found");
                return;
            }
            res.status(200).json({ message: "Note deleted." });
        }
        catch (error) {
            res.status(500).send("Failed to delete note: " + error);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
