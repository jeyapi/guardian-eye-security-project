const app = require('./src/app');
const PORT = 3001;

// Start server
function startServer() {
    try {
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
process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    process.exit(0);
});
