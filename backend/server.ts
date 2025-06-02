import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { setupSwaggerDocs } from './docs/swagger';

// Import DB connection
import { connect } from './repository/database';

// Import routes
import authRoutes from './routes/auth.routes';
import noteRoutes from './routes/note.routes';
import taskRoutes from './routes/taskRoutes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

//  Middleware
app.use(cors());
app.use(express.json()); // enables req.body parsing

//  Root route for Render and health check
app.get('/', (req, res) => {
  res.send('API is running ');
});

//  Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tasks', taskRoutes);

//  Connect to MongoDB
connect();

//  Swagger Docs
setupSwaggerDocs(app);

//  Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
