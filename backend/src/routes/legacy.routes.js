const express = require('express');
const path = require('path');
const DatabaseManager = require('../database');
const CSVParser = require('../csvParser');
const AnomalyDetector = require('../anomalyDetector');
const ProfileBuilder = require('../profileBuilder');

const router = express.Router();

// Initialize legacy services
const anomalyDetector = new AnomalyDetector();
const profileBuilder = new ProfileBuilder();

// Helper function to get database instance
async function getDb() {
    return await DatabaseManager.getInstance();
}

/**
 * GET /stats
 * Get statistics about logs and anomalies
 */
router.get('/stats', async (req, res) => {
    try {
        const db = await getDb();
        const stats = await db.getStats();
        res.json({ success: true, stats });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * GET /logs
 * Get all logs or just anomalies
 */
router.get('/logs', async (req, res) => {
    try {
        const db = await getDb();
        const { anomalies } = req.query;
        const logs = anomalies === 'true' ? await db.getAnomalies() : await db.getAllLogs();
        res.json({ success: true, data: logs });
    } catch (error) {
        console.error('Error getting logs:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * POST /ingest
 * Ingest data from CSV file
 */
router.post('/ingest', async (req, res) => {
    try {
        console.log('Starting data ingestion...');
        const db = await getDb();

        const csvPath = path.join(__dirname, '..', '..', '..', 'public', 'data', 'device.csv');
        console.log('CSV path:', csvPath);

        const parser = new CSVParser(csvPath);
        const logs = await parser.parseCSV();

        // Insert logs into database
        await db.insertLogs(logs);

        const stats = await db.getStats();
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
 * POST /build-profiles
 * Build user profiles from existing logs
 */
router.post('/build-profiles', async (req, res) => {
    try {
        console.log('Building user profiles...');
        const db = await getDb();

        const logs = await db.getAllLogs();
        if (logs.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No logs found. Please ingest data first.'
            });
        }

        const profiles = profileBuilder.buildProfiles(logs);

        // Save profiles to database (batch insert for performance)
        await db.batchInsertProfiles(profiles);

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
 * POST /detect-anomalies
 * Detect anomalies in logs using AI
 */
router.post('/detect-anomalies', async (req, res) => {
    try {
        console.log('Detecting anomalies...');
        const db = await getDb();

        const logs = await db.getAllLogs();
        const profiles = await db.getAllProfiles();

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

        // Update database with anomaly scores (batch update for performance)
        await db.batchUpdateAnomalyScores(results);

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
 * GET /profiles
 * Get all user profiles
 */
router.get('/profiles', async (req, res) => {
    try {
        const db = await getDb();
        const profiles = await db.getAllProfiles();
        res.json({ success: true, data: profiles });
    } catch (error) {
        console.error('Error getting profiles:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * DELETE /clear
 * Clear all data (for testing)
 */
router.delete('/clear', async (req, res) => {
    try {
        const db = await getDb();
        await db.clearAllData();
        res.json({ success: true, message: 'All data cleared successfully' });
    } catch (error) {
        console.error('Error clearing data:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
