import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import http from 'http';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Server } from 'socket.io';

// __filename and __dirname equivalents for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define allowed origins properly
const allowedOrigins = [
  'http://localhost:5173',                  // dev
  'https://e-yantra-backend.onrender.com'  // deployed frontend
];

// Create Express app
const app = express();

// Setup HTTPS server
const server = http.createServer(app);

// Setup Socket.io server with CORS config consistent with Express
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Accept connections with no origin (like socket clients)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  },
});

// CORS middleware options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests for all routes with CORS headers
app.options('*', cors(corsOptions));

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage setup
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Enforce HTTPS in production before routes
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// Import API routes (ES module imports)
import userapi from './apis/userapi.js';
import optapi from './apis/otpapi.js';
import notificationsapi from './apis/notificationapi.js';
import resourcesapi from './apis/resourcesapi.js';
import teamapi from './apis/teamapi.js';
import eventapi from './apis/eventapi.js';
import statsapi from './apis/statsapi.js';
import projectsapi from './apis/projectsapi.js';
import messageapi from './apis/messagesapi.js';

// Use API routes, injecting io for socket use where needed
app.use('/api', (req, res, next) => {
  req.io = io;
  next();
}, optapi);

app.use('/api/user', (req, res, next) => {
  req.io = io;
  next();
}, userapi);

app.use('/api/eyantra', (req, res, next) => {
  req.io = io;
  next();
}, notificationsapi);

app.use('/api/res', resourcesapi);
app.use('/api/teams', teamapi);
app.use('/api/overview', statsapi);

app.use('/api/events', (req, res, next) => {
  req.io = io;
  next();
}, eventapi);

app.use('/api/projects', (req, res, next) => {
  req.io = io;
  next();
}, projectsapi);

app.use('/api/message', (req, res, next) => {
  req.io = io;
  next();
}, messageapi);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

