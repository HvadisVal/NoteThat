import request from 'supertest';
import express from 'express';
import noteRoutes from '../routes/note.routes';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config({ path: '.env.test.ci' });

// ✅ Create a minimal Express app instance for isolated testing
const app = express();
app.use(express.json());
app.use('/api/notes', noteRoutes);

let token: string;

console.log('🔍 TEST_USER_TOKEN in CI:', process.env.TEST_USER_TOKEN || 'undefined');

describe('Notes API', () => {
  // ✅ Load token once before tests
  beforeAll(() => {
    const payload = {
      id: '67e7eb090f54a67cb1707b6c',
      name: 'Valion',
      email: 'valion@example.com'
    };
  
    const jwtSecret = process.env.JWT_SECRET || 'fallback';
    token = jwt.sign(payload, jwtSecret, { expiresIn: '2h' });
  });

  // ✅ Test 1: GET request without a token should return 401
  it('should return 401 if user is not authenticated', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.statusCode).toBe(401);
  });

  // ✅ Test 2: POST request without token should return 401
  it('should fail to create note without token', async () => {
    const res = await request(app).post('/api/notes').send({
      title: 'Test Note',
      content: 'This is a test note',
    });
    expect(res.statusCode).toBe(401);
  });

  // ✅ Test 3: GET request with a valid token should return 200 or 204
  it('should return 200 or 204 when authenticated', async () => {
    const res = await request(app)
  .get('/api/notes')
  .set('Authorization', `Bearer ${token}`)

    
    expect([200, 204]).toContain(res.statusCode);
  });
});
