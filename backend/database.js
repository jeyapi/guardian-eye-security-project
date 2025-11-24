const Database = require('better-sqlite3');
const path = require('path');

class DatabaseManager {
    constructor() {
        const dbPath = path.join(__dirname, 'guardian-eye.db');
        this.db = new Database(dbPath);
        this.initializeTables();
    }

    initializeTables() {
        // Create device_logs table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS device_logs (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        user_name TEXT NOT NULL,
        pc TEXT NOT NULL,
        activity TEXT NOT NULL,
        anomaly_score REAL DEFAULT 0,
        is_anomaly INTEGER DEFAULT 0
      )
    `);

        // Create user_profiles table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        user_name TEXT PRIMARY KEY,
        unique_pcs INTEGER DEFAULT 0,
        total_connections INTEGER DEFAULT 0,
        avg_hour REAL DEFAULT 0,
        off_hours_count INTEGER DEFAULT 0
      )
    `);

        // Create indexes for better performance
        this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_user_name ON device_logs(user_name);
      CREATE INDEX IF NOT EXISTS idx_is_anomaly ON device_logs(is_anomaly);
      CREATE INDEX IF NOT EXISTS idx_date ON device_logs(date);
    `);
    }

    insertLogs(logs) {
        const insert = this.db.prepare(`
      INSERT OR REPLACE INTO device_logs (id, date, user_name, pc, activity, anomaly_score, is_anomaly)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

        const insertMany = this.db.transaction((logs) => {
            for (const log of logs) {
                insert.run(
                    log.id,
                    log.date,
                    log.user_name,
                    log.pc,
                    log.activity,
                    log.anomaly_score || 0,
                    log.is_anomaly || 0
                );
            }
        });

        insertMany(logs);
    }

    getAllLogs() {
        return this.db.prepare('SELECT * FROM device_logs ORDER BY date DESC').all();
    }

    getAnomalies() {
        return this.db.prepare('SELECT * FROM device_logs WHERE is_anomaly = 1 ORDER BY anomaly_score DESC, date DESC LIMIT 100').all();
    }

    getStats() {
        const total = this.db.prepare('SELECT COUNT(*) as count FROM device_logs').get();
        const anomalies = this.db.prepare('SELECT COUNT(*) as count FROM device_logs WHERE is_anomaly = 1').get();
        const users = this.db.prepare('SELECT COUNT(DISTINCT user_name) as count FROM device_logs').get();

        return {
            total: total.count,
            anomalies: anomalies.count,
            users: users.count
        };
    }

    updateLogAnomalyScore(id, score, isAnomaly) {
        const update = this.db.prepare(`
      UPDATE device_logs 
      SET anomaly_score = ?, is_anomaly = ?
      WHERE id = ?
    `);
        update.run(score, isAnomaly ? 1 : 0, id);
    }

    insertOrUpdateProfile(profile) {
        const upsert = this.db.prepare(`
      INSERT OR REPLACE INTO user_profiles (user_name, unique_pcs, total_connections, avg_hour, off_hours_count)
      VALUES (?, ?, ?, ?, ?)
    `);
        upsert.run(
            profile.user_name,
            profile.unique_pcs,
            profile.total_connections,
            profile.avg_hour,
            profile.off_hours_count
        );
    }

    getAllProfiles() {
        return this.db.prepare('SELECT * FROM user_profiles').all();
    }

    getProfileByUser(userName) {
        return this.db.prepare('SELECT * FROM user_profiles WHERE user_name = ?').get(userName);
    }

    clearAllData() {
        this.db.exec('DELETE FROM device_logs');
        this.db.exec('DELETE FROM user_profiles');
    }

    close() {
        this.db.close();
    }
}

module.exports = DatabaseManager;
