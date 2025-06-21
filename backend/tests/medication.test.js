import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

const testUser = {
  username: 'meduser',
  password: 'medpass123',
  role: 'patient',
};

let token = '';
let medId = null;

beforeAll(async () => {
  await new Promise((resolve) => db.run('DELETE FROM users WHERE username = ?', [testUser.username], resolve));
  await request(app).post('/api/auth/register').send(testUser);
  const res = await request(app).post('/api/auth/login').send({ username: testUser.username, password: testUser.password });
  token = res.body.token;
});

afterAll((done) => {
  db.run('DELETE FROM users WHERE username = ?', [testUser.username], done);
});

describe('Medication API', () => {
  it('should add a medication', async () => {
    const res = await request(app)
      .post('/api/medications')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Aspirin', dosage: '100mg', frequency: 'daily' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    medId = res.body.id;
  });

  it('should list medications', async () => {
    const res = await request(app)
      .get('/api/medications')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(med => med.id === medId)).toBe(true);
  });

  it('should update a medication', async () => {
    const res = await request(app)
      .put(`/api/medications/${medId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Aspirin', dosage: '200mg', frequency: 'twice daily' });
    expect(res.status).toBe(200);
    expect(res.body.dosage).toBe('200mg');
  });

  it('should delete a medication', async () => {
    const res = await request(app)
      .delete(`/api/medications/${medId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
}); 