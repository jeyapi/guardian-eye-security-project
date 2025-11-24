const express = require('express');
const cors = require('cors');

// Import routes
const legacyRoutes = require('./routes/legacy.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes - Legacy routes for data ingestion and anomaly detection
app.use('/api', legacyRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'GuardianEye Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
