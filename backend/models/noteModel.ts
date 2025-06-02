import { Schema, model } from 'mongoose';
import { Note, Collaborator } from '../interfaces/note';

const collaboratorSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    avatar: { type: String } // optional
  },
  { _id: false } // prevents Mongoose from adding an unnecessary _id to each collaborator
);

const noteSchema = new Schema<Note>({
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
  }});

export const NoteModel = model<Note>('Note', noteSchema);
