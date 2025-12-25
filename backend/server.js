const app = require('./src/app');
const DatabaseManager = require('./src/database');
const PORT = parseInt(process.env.PORT) || 3001;

// Validate PORT
if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
    console.error('Invalid PORT configuration');
    process.exit(1);
}

// Start server
async function startServer() {
    try {
        // Initialize database (singleton pattern)
        console.log('🔄 Initializing TypeORM database...');
        await DatabaseManager.getInstance();
        console.log('✅ Database initialized');

        app.listen(PORT, () => {
            console.log(`\n🛡️  GuardianEye Backend Server`);
            console.log(`📡 Server running on http://localhost:${PORT}`);
            console.log(`✅ Ready to process requests`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    try {
        const db = await DatabaseManager.getInstance();
        await db.close();
    } catch (error) {
        console.error('Error during shutdown:', error);
    }
    process.exit(0);
});
