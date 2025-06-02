import { Response } from 'express';
import { NoteModel } from '../models/noteModel';
import { AuthRequest } from '../interfaces/authRequest';
import { connect, disconnect } from '../repository/database';


/**
 * Get all notes for the logged-in user
 */
export async function getNotes(req: AuthRequest, res: Response) {
  try {
    await connect();
    const notes = await NoteModel.find({ userId: req.user?.id });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).send("Failed to fetch notes: " + error);
  } finally {
    await disconnect();
  }
}

/**
 * Create a new note
 */
export async function createNote(req: AuthRequest, res: Response) {
  try {
    await connect();
    const note = new NoteModel({
      ...req.body,
      userId: req.user?.id,
      timestamp: new Date()
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).send("Failed to create note: " + error);
  } finally {
    await disconnect();
  }
}

/**
 * Update a note
 */
export async function updateNote(req: AuthRequest, res: Response) {
  try {
    await connect();
    const updated = await NoteModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      req.body,
      { new: true }
    );

    if (!updated) {
        res.status(404).send("Note not found");
        return;
      }      
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).send("Failed to update note: " + error);
  } finally {
    await disconnect();
  }
}

/**
 * Delete a note
 */
export async function deleteNote(req: AuthRequest, res: Response) {
  try {
    await connect();
    const deleted = await NoteModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?.id
    });
      
    if (!deleted) {
        res.status(404).send("Note not found");
        return;
        }
    res.status(200).json({ message: "Note deleted." });
  } catch (error) {
    res.status(500).send("Failed to delete note: " + error);
  } finally {
    await disconnect();
  }
}
