import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

const testUser = {
  username: 'adhuser',
  password: 'adhpass123',
  role: 'patient',
};

let token = '';
let medId = null;

beforeAll(async () => {
  await new Promise((resolve) => db.run('DELETE FROM users WHERE username = ?', [testUser.username], resolve));
  await request(app).post('/api/auth/register').send(testUser);
  const res = await request(app).post('/api/auth/login').send({ username: testUser.username, password: testUser.password });
  token = res.body.token;
  // Add medication
  const medRes = await request(app)
    .post('/api/medications')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Vitamin C', dosage: '500mg', frequency: 'daily' });
  medId = medRes.body.id;
});

afterAll((done) => {
  db.run('DELETE FROM users WHERE username = ?', [testUser.username], done);
});

describe('Adherence API', () => {
  it('should have 0 adherence before marking as taken', async () => {
    const res = await request(app)
      .get('/api/intake/adherence')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.adherence).toBeTypeOf('number');
  });

  it('should mark medication as taken and update adherence', async () => {
    await request(app)
      .post(`/api/intake/${medId}`)
      .set('Authorization', `Bearer ${token}`);
    const res = await request(app)
      .get('/api/intake/adherence')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.adherence).toBeGreaterThanOrEqual(0);
    expect(res.body.adherence).toBeLessThanOrEqual(100);
  });
}); 