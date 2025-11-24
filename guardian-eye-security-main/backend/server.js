const express = require('express');
const cors = require('cors');
const path = require('path');
const DatabaseManager = require('./database');
const CSVParser = require('./csvParser');
const AnomalyDetector = require('./anomalyDetector');
const ProfileBuilder = require('./profileBuilder');

const app = express();
const PORT = 3001;

// Initialize services
const db = new DatabaseManager();
const anomalyDetector = new AnomalyDetector();
const profileBuilder = new ProfileBuilder();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes

/**
 * GET /api/stats
 * Get statistics about logs and anomalies
 */
app.get('/api/stats', (req, res) => {
    try {
        const stats = db.getStats();
        res.json({ success: true, stats });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * GET /api/logs
 * Get all logs or just anomalies
 */
app.get('/api/logs', (req, res) => {
    try {
        const { anomalies } = req.query;
        const logs = anomalies === 'true' ? db.getAnomalies() : db.getAllLogs();
        res.json({ success: true, data: logs });
    } catch (error) {
        console.error('Error getting logs:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * POST /api/ingest
 * Ingest data from CSV file
 */
app.post('/api/ingest', async (req, res) => {
    try {
        console.log('Starting data ingestion...');

        const csvPath = path.join(__dirname, '..', 'public', 'data', 'device.csv');
        const parser = new CSVParser(csvPath);
        const logs = await parser.parseCSV();

        // Insert logs into database
        db.insertLogs(logs);

        const stats = db.getStats();
        console.log(`Ingestion complete: ${stats.total} logs inserted`);

        res.json({
            success: true,
            message: `Data ingestion completed successfully. Inserted ${stats.total} logs.`,
            stats
        });
    } catch (error) {
        console.error('Ingestion error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * POST /api/build-profiles
 * Build user profiles from existing logs
 */
app.post('/api/build-profiles', (req, res) => {
    try {
        console.log('Building user profiles...');

        const logs = db.getAllLogs();
        if (logs.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No logs found. Please ingest data first.'
            });
        }

        const profiles = profileBuilder.buildProfiles(logs);

        // Save profiles to database
        profiles.forEach(profile => {
            db.insertOrUpdateProfile(profile);
        });

        console.log(`Built ${profiles.length} user profiles`);

        res.json({
            success: true,
            message: `User profiles built successfully. Created ${profiles.length} profiles.`,
            count: profiles.length
        });
    } catch (error) {
        console.error('Profile building error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * POST /api/detect-anomalies
 * Detect anomalies in logs using AI
 */
app.post('/api/detect-anomalies', (req, res) => {
    try {
        console.log('Detecting anomalies...');

        const logs = db.getAllLogs();
        const profiles = db.getAllProfiles();

        if (logs.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No logs found. Please ingest data first.'
            });
        }

        if (profiles.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No profiles found. Please build profiles first.'
            });
        }

        // Run anomaly detection
        const results = anomalyDetector.runDetection(logs, profiles);

        // Update database with anomaly scores
        results.forEach(result => {
            db.updateLogAnomalyScore(result.id, result.score, result.isAnomaly);
        });

        const anomalyCount = results.filter(r => r.isAnomaly).length;
        console.log(`Detected ${anomalyCount} anomalies`);

        res.json({
            success: true,
            message: `Detected ${anomalyCount} anomalies out of ${logs.length} logs.`,
            details: { total: logs.length, anomalies: anomalyCount }
        });
    } catch (error) {
        console.error('Detection error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * GET /api/profiles
 * Get all user profiles
 */
app.get('/api/profiles', (req, res) => {
    try {
        const profiles = db.getAllProfiles();
        res.json({ success: true, data: profiles });
    } catch (error) {
        console.error('Error getting profiles:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * DELETE /api/clear
 * Clear all data (for testing)
 */
app.delete('/api/clear', (req, res) => {
    try {
        db.clearAllData();
        res.json({ success: true, message: 'All data cleared successfully' });
    } catch (error) {
        console.error('Error clearing data:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'GuardianEye Backend is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🛡️  GuardianEye Backend Server`);
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`✅ Ready to process requests\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    db.close();
    process.exit(0);
});
