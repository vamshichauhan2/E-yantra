// Import required modules
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

// ES module equivalents
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://e-yantra-backend.onrender.com'
];

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Setup Socket.io server with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Use CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Enable CORS preflight for all routes
app.options('*', cors());

// Other middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer config
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

// Force HTTPS in production
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// Import API routes
import userapi from './apis/userapi.js';
import optapi from './apis/otpapi.js';
import notificationsapi from './apis/notificationapi.js';
import resourcesapi from './apis/resourcesapi.js';
import teamapi from './apis/teamapi.js';
import eventapi from './apis/eventapi.js';
import statsapi from './apis/statsapi.js';
import projectsapi from './apis/projectsapi.js';
import messageapi from './apis/messagesapi.js';

// Use API routes (pass socket.io instance via req)
app.use('/api', (req, res, next) => { req.io = io; next(); }, optapi);
app.use('/api/user', (req, res, next) => { req.io = io; next(); }, userapi);
app.use('/api/eyantra', (req, res, next) => { req.io = io; next(); }, notificationsapi);
app.use('/api/res/', resourcesapi);
app.use('/api/teams/', teamapi);
app.use('/api/overview/', statsapi);
app.use('/api/events', (req, res, next) => { req.io = io; next(); }, eventapi);
app.use('/api/projects/', (req, res, next) => { req.io = io; next(); }, projectsapi);
app.use('/api/message/', (req, res, next) => { req.io = io; next(); }, messageapi);

// Start the server with correct string interpolation
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
