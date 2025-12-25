require('reflect-metadata');
require('dotenv').config();
const { DataSource } = require('typeorm');
const path = require('path');
const DeviceLog = require('./entities/DeviceLog');
const UserProfile = require('./entities/UserProfile');

// Determine database type from environment
const dbType = process.env.DB_TYPE || 'sqlite';

let dataSourceConfig;

const isProduction = process.env.NODE_ENV === 'production';

if (dbType === 'postgres') {
    // PostgreSQL Configuration
    dataSourceConfig = {
        type: 'postgres',
        host: process.env.PG_HOST || 'localhost',
        port: parseInt(process.env.PG_PORT) || 5432,
        username: process.env.PG_USERNAME || 'postgres',
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE || 'guardian_eye',
        ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
        synchronize: !isProduction, // Only auto-create tables in development
        logging: process.env.DB_LOGGING === 'true',
        entities: [DeviceLog, UserProfile],
        migrations: [],
        subscribers: []
    };
    console.log(`📊 Using PostgreSQL database (${isProduction ? 'Production' : 'Development'})`);
} else {
    // SQLite Configuration (default)
    dataSourceConfig = {
        type: 'better-sqlite3',
        database: process.env.DB_PATH || path.join(__dirname, 'guardian-eye.db'),
        synchronize: !isProduction,
        logging: process.env.DB_LOGGING === 'true',
        entities: [DeviceLog, UserProfile],
        migrations: [],
        subscribers: []
    };
    console.log(`📊 Using SQLite database (${isProduction ? 'Production' : 'Development'})`);
}

const AppDataSource = new DataSource(dataSourceConfig);

module.exports = AppDataSource;
