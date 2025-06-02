// scripts/seedTestUser.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/userModel';

dotenv.config({ path: '.env.test' });

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI!);

  const existing = await UserModel.findOne({ email: 'valion@example.com' });
  if (!existing) {
    const hashed = await bcrypt.hash('notethat123', 10);
    await UserModel.create({
      name: 'Valion',
      email: 'valion@example.com',
      password: hashed,
    });
    console.log(' Test user seeded.');
  } else {
    console.log(' Test user already exists.');
  }

  await mongoose.disconnect();
};

seed();
