import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

console.log('Initializing environment variables...');
dotenv.config();

console.log('Setting up Express app...');
const app = express();

// Define the port to use from .env or default to 3000
const PORT = parseInt(process.env.PORT || '3000', 10);
console.log(`PORT to be used: ${PORT}`);

// Middleware
console.log('Adding middleware...');
app.use(cors());
app.use(bodyParser.json());

// Test Route
app.get('/api/health', (req, res) => {
    console.log('Health endpoint was hit.');
    res.status(200).send({ message: 'API is working!' });
});

// Start Server
console.log('Starting the server...');
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Error starting the server:', err.message);
});
