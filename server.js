import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';

const app = express();
const server = http.createServer(app);

// Setup Socket.IO with CORS options
const ios = new Server(server, {
  cors: {
    origin: "http://localhost:8081",  // Your frontend origin here
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }
});

// Middleware to attach Socket.IO instance to req object
app.use((req, res, next) => {
  req.io = ios;
  next();
});

// Enable CORS for all routes and handle credentials
app.use(cors({
  origin: "http://localhost:8081",
  credentials: true
}));

// Handle preflight OPTIONS requests for all routes
app.options('*', cors());

// Parse JSON request bodies
app.use(express.json());

// Parse cookies from requests
app.use(cookieParser());

// Define your routes
app.use('/api/auth', authRoutes);

// Optional: Socket.IO event handling
// ios.on('connection', (socket) => {
//   console.log('Client connected:', socket.id);
//   socket.on('disconnect', () => {
//     console.log('Client disconnected:', socket.id);
//   });
// });

// Start server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});