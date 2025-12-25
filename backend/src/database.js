const AppDataSource = require('./data-source');

let dbInstance = null;

class DatabaseManager {
    constructor() {
        this.dataSource = null;
        this.deviceLogRepository = null;
        this.userProfileRepository = null;
    }

    static async getInstance() {
        if (!dbInstance) {
            dbInstance = new DatabaseManager();
            await dbInstance.initialize();
        }
        return dbInstance;
    }

    async initialize() {
        if (!this.dataSource || !this.dataSource.isInitialized) {
            this.dataSource = await AppDataSource.initialize();
            this.deviceLogRepository = this.dataSource.getRepository('DeviceLog');
            this.userProfileRepository = this.dataSource.getRepository('UserProfile');
            console.log('✅ TypeORM Database initialized successfully');
        }
        return this;
    }

    async insertLogs(logs) {
        if (!logs || logs.length === 0) {
            console.log('No logs to insert');
            return;
        }

        const BATCH_SIZE = 5000; // Larger batches for PostgreSQL
        const totalBatches = Math.ceil(logs.length / BATCH_SIZE);
        
        console.log(`Inserting ${logs.length} logs in ${totalBatches} batches...`);
        
        try {
            const dbType = this.dataSource.options.type;
            
            for (let i = 0; i < logs.length; i += BATCH_SIZE) {
                const batch = logs.slice(i, Math.min(i + BATCH_SIZE, logs.length));
                
                if (dbType === 'postgres') {
                    // Use PostgreSQL COPY-like bulk insert (fast & safe)
                    await this.deviceLogRepository
                        .createQueryBuilder()
                        .insert()
                        .into('device_logs')
                        .values(batch.map(log => ({
                            id: String(log.id),
                            date: String(log.date),
                            user_name: String(log.user_name),
                            pc: String(log.pc),
                            activity: String(log.activity),
                            anomaly_score: Number(log.anomaly_score) || 0,
                            is_anomaly: Number(log.is_anomaly) || 0
                        })))
                        .orUpdate(['date', 'user_name', 'pc', 'activity', 'anomaly_score', 'is_anomaly'], ['id'])
                        .execute();
                } else {
                    // SQLite fallback
                    const entities = batch.map(log => this.deviceLogRepository.create({
                        id: String(log.id),
                        date: String(log.date),
                        user_name: String(log.user_name),
                        pc: String(log.pc),
                        activity: String(log.activity),
                        anomaly_score: Number(log.anomaly_score) || 0,
                        is_anomaly: Number(log.is_anomaly) || 0
                    }));
                    await this.deviceLogRepository.save(entities);
                }
                
                const currentBatch = Math.floor(i / BATCH_SIZE) + 1;
                if (currentBatch % 2 === 0 || currentBatch === totalBatches) {
                    console.log(`  Processed ${currentBatch}/${totalBatches} batches (${Math.min(i + BATCH_SIZE, logs.length)}/${logs.length} records)`);
                }
            }
            
            console.log(`✅ Successfully inserted ${logs.length} logs`);
        } catch (error) {
            console.error('Error inserting logs:', error.message);
            throw error;
        }
    }

    async getAllLogs() {
        return await this.deviceLogRepository.find({
            order: { date: 'DESC' }
        });
    }

    async getAnomalies() {
        return await this.deviceLogRepository.find({
            where: { is_anomaly: 1 },
            order: { anomaly_score: 'DESC', date: 'DESC' },
            take: 100
        });
    }

    async getStats() {
        const total = await this.deviceLogRepository.count();
        const anomalies = await this.deviceLogRepository.count({
            where: { is_anomaly: 1 }
        });
        
        const usersQuery = await this.deviceLogRepository
            .createQueryBuilder('log')
            .select('COUNT(DISTINCT log.user_name)', 'count')
            .getRawOne();

        return {
            total,
            anomalies,
            users: parseInt(usersQuery.count)
        };
    }

    async updateLogAnomalyScore(id, score, isAnomaly) {
        await this.deviceLogRepository.update(
            { id },
            { 
                anomaly_score: score, 
                is_anomaly: isAnomaly ? 1 : 0 
            }
        );
    }

    async batchUpdateAnomalyScores(results) {
        const BATCH_SIZE = 1000;
        const totalBatches = Math.ceil(results.length / BATCH_SIZE);
        
        console.log(`Updating ${results.length} anomaly scores in ${totalBatches} batches...`);
        
        for (let i = 0; i < results.length; i += BATCH_SIZE) {
            const batch = results.slice(i, Math.min(i + BATCH_SIZE, results.length));
            
            // Use raw SQL CASE statement for bulk update (much faster than individual updates)
            const whenScoreClauses = batch.map(r => 
                `WHEN '${r.id.replace(/'/g, "''")}' THEN ${r.score}`
            ).join(' ');
            
            const whenAnomalyClauses = batch.map(r => 
                `WHEN '${r.id.replace(/'/g, "''")}' THEN ${r.isAnomaly ? 1 : 0}`
            ).join(' ');
            
            const ids = batch.map(r => `'${r.id.replace(/'/g, "''")}'`).join(',');
            
            const sql = `
                UPDATE device_logs 
                SET 
                    anomaly_score = CASE id ${whenScoreClauses} END,
                    is_anomaly = CASE id ${whenAnomalyClauses} END
                WHERE id IN (${ids})
            `;
            
            await this.dataSource.query(sql);
            
            const currentBatch = Math.floor(i / BATCH_SIZE) + 1;
            if (currentBatch % 10 === 0 || currentBatch === totalBatches) {
                console.log(`  Updated ${currentBatch}/${totalBatches} batches (${Math.min(i + BATCH_SIZE, results.length)}/${results.length} records)`);
            }
        }
        
        console.log(`✅ Successfully updated ${results.length} anomaly scores`);
    }

    async insertOrUpdateProfile(profile) {
        const entity = this.userProfileRepository.create({
            user_name: profile.user_name,
            unique_pcs: profile.unique_pcs,
            total_connections: profile.total_connections,
            avg_hour: profile.avg_hour,
            off_hours_count: profile.off_hours_count
        });

        await this.userProfileRepository.save(entity);
    }

    async batchInsertProfiles(profiles) {
        console.log(`Inserting ${profiles.length} user profiles...`);
        
        const entities = profiles.map(profile => this.userProfileRepository.create({
            user_name: profile.user_name,
            unique_pcs: profile.unique_pcs,
            total_connections: profile.total_connections,
            avg_hour: profile.avg_hour,
            off_hours_count: profile.off_hours_count
        }));

        await this.userProfileRepository.save(entities);
        console.log(`✅ Successfully inserted ${profiles.length} profiles`);
    }

    async getAllProfiles() {
        return await this.userProfileRepository.find();
    }

    async getProfileByUser(userName) {
        return await this.userProfileRepository.findOne({
            where: { user_name: userName }
        });
    }

    async clearAllData() {
        await this.deviceLogRepository.clear();
        await this.userProfileRepository.clear();
    }

    async close() {
        if (this.dataSource && this.dataSource.isInitialized) {
            await this.dataSource.destroy();
            dbInstance = null;
        }
    }
}

module.exports = DatabaseManager;
