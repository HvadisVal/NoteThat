import { Document } from 'mongoose';

export interface Collaborator {
  userId: string;
  name: string;
  avatar?: string;
}

export interface Note extends Document {
  title: string;
  content: string;
  category: string;
  color: string;
  tags: string[];
  pinned: boolean;
  userId: string;
  timestamp: Date;
  collaborators?: Collaborator[]; 
}
