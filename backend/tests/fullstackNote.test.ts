import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import noteRoutes from '../routes/note.routes';
import { connect, disconnect } from '../repository/database';

dotenv.config({ path: '.env.test.ci' });

const app = express();
app.use(express.json());
app.use('/api/notes', noteRoutes);

let token: string;

beforeAll(async () => {
  await connect();

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("❌ JWT_SECRET is missing in CI");
  }

  const payload = {
    id: '67e7eb090f54a67cb1707b6c',
    name: 'Valion',
    email: 'valion@example.com',
  };

  token = jwt.sign(payload, jwtSecret, { expiresIn: '2h' });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('🧪 Fullstack Note Creation Test', () => {
  it('should create and retrieve a note for authenticated user', async () => {
    const testNote = {
      title: 'Integration Note',
      content: 'Created via fullstack test',
      category: 'Test',
      color: 'bg-blue-400',
      tags: ['e2e'],
      pinned: false
    };

    const createRes = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send(testNote);

    console.log('❌ Create response body:', createRes.body);
    expect(createRes.statusCode).toBe(201);
    expect(createRes.body.title).toBe(testNote.title);

    const getRes = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.statusCode).toBe(200);
    const found = getRes.body.find((n: any) => n.title === testNote.title);
    expect(found).toBeDefined();
  });
});
