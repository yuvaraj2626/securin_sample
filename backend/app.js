import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { fetchAndStoreCVE, initializeCVEScheduler } from './services/cveService.js';
import { CVE } from './models/cveModels.js';
import cveRouter from './routers/cveRouters.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });
if (!process.env.MONGO_URL) {
    dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
}

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'CVE API Server is running', status: 'OK' });
});

// API Routes
app.use('/api', cveRouter);

const PORT = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
    console.error('Missing MONGO_URL. Add it to a .env file or set it in the environment.');
    process.exit(1);
}

// Initialize scheduler for periodic CVE sync
initializeCVEScheduler();

// Fetch CVE data on startup
fetchAndStoreCVE();

// Connect to MongoDB
connectDB(mongoUrl)
    .then(async () => {
        console.log('Database connected successfully.');

        app.listen(PORT, () => {
            console.log(`Server running on Port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });

