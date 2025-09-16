import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import { rateLimit } from 'express-rate-limit'


const app = express();
const server = http.createServer(app);

// Dynamic CORS origin function
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://g1682vd4-8081.uks1.devtunnels.ms',
      'https://36b1d44ff578.ngrok-free.app',
      'http://localhost:8081',
      'http://192.168.1.9:8081',
      'http://localhost:3000',
      'http://127.0.0.1:8081',
      'http://localhost:19006', // Expo dev server
      'http://localhost:19000',
      'http://localhost:19001',
      'http://localhost:19002'
    ];
    
    // Also allow any ngrok and devtunnels subdomains
    if (origin.endsWith('.ngrok-free.app') || origin.endsWith('.devtunnels.ms')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

// Setup Socket.IO with CORS options
const ios = new Server(server, {
  cors: corsOptions
});


const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 15 minutes
	limit: 1, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
    handler: (req, res) => {
    res.status(429).send('Too many requests, please try again later.');
  },
})

// Apply the rate limiting middleware to all requests.
//app.use(limiter)

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests for all routes
app.options('*', cors(corsOptions));

// Middleware to attach Socket.IO instance to req object
app.use((req, res, next) => {
  req.io = ios;
  next();
});

// Parse JSON request bodiess
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Parse cookies from requests
app.use(cookieParser());

// Add additional headers for CORS in response
// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   if (origin && (origin.includes('ngrok-free.app') || origin.includes('devtunnels.ms') || origin.includes('localhost'))) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   next();
// });

// Define your routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Optional: Socket.IO event handling
ios.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Origin not allowed',
      requestedOrigin: req.headers.origin
    });
  }
  
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found` 
  });
});

// Start server
const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
  console.log('✅ CORS configured for:');
  console.log('   - https://g1682vd4-8081.uks1.devtunnels.ms');
  console.log('   - https://36b1d44ff578.ngrok-free.app');
  console.log('   - All ngrok-free.app subdomains');
  console.log('   - All devtunnels.ms subdomains');
  console.log('   - Localhost ports 3000, 8081, 19000-19006');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

export { app, ios };