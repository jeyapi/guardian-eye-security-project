# TypeORM Migration Documentation

## Overview

The GuardianEye backend has been successfully refactored to use **TypeORM**, a modern Object-Relational Mapping (ORM) library for TypeScript and JavaScript. This migration replaces the direct `better-sqlite3` database queries with TypeORM's repository pattern.

## Changes Made

### 1. Dependencies Added

Added to `backend/package.json`:
- `typeorm: ^0.3.20` - The main ORM library
- `reflect-metadata: ^0.2.1` - Required for TypeORM decorators and metadata reflection

### 2. New Files Created

#### `backend/src/entities/DeviceLog.js`
Entity schema for the `device_logs` table with the following fields:
- `id` (Primary Key)
- `date`
- `user_name`
- `pc`
- `activity`
- `anomaly_score`
- `is_anomaly`

Includes indexes on `user_name`, `is_anomaly`, and `date` for optimal query performance.

#### `backend/src/entities/UserProfile.js`
Entity schema for the `user_profiles` table with the following fields:
- `user_name` (Primary Key)
- `unique_pcs`
- `total_connections`
- `avg_hour`
- `off_hours_count`

#### `backend/src/data-source.js`
TypeORM DataSource configuration:
- Database type: `better-sqlite3`
- Database path: `guardian-eye.db`
- Auto-synchronization enabled (creates tables automatically)
- Entities registered: DeviceLog and UserProfile

### 3. Refactored Files

#### `backend/src/database.js`
Complete rewrite to use TypeORM:
- **Before**: Direct SQL queries using `better-sqlite3`
- **After**: Repository pattern with TypeORM
- All methods now return Promises (async/await)
- Added `initialize()` method to set up the database connection
- Replaced SQL queries with TypeORM query methods

Key changes:
- `insertLogs()` - Now uses repository `create()` and `save()`
- `getAllLogs()` - Uses `find()` with ordering
- `getAnomalies()` - Uses `find()` with `where` clause
- `getStats()` - Uses `count()` and query builder for distinct counts
- `updateLogAnomalyScore()` - Uses repository `update()`
- `insertOrUpdateProfile()` - Uses repository `save()` (upsert)
- `clearAllData()` - Uses repository `clear()`

#### `backend/src/routes/legacy.routes.js`
Updated all route handlers to be async:
- Database initialization moved to async IIFE
- All database method calls now use `await`
- Changed `forEach` loops to `for...of` loops for async operations

#### `backend/server.js`
- Added async initialization in `startServer()`
- Database is initialized before starting the Express server
- Graceful shutdown now properly closes the TypeORM connection

## Benefits of TypeORM

1. **Type Safety**: Better IDE support and type checking
2. **Abstraction**: Database-agnostic queries (easier to switch databases)
3. **Maintainability**: Cleaner code with repository pattern
4. **Migrations**: Built-in migration system for schema changes
5. **Relations**: Easy to define and query relationships between entities
6. **Query Builder**: Powerful query builder for complex queries

## Migration Guide for Developers

### Before (better-sqlite3)
```javascript
const db = new DatabaseManager();
const logs = db.getAllLogs(); // Synchronous
```

### After (TypeORM)
```javascript
const db = await new DatabaseManager().initialize();
const logs = await db.getAllLogs(); // Asynchronous
```

### Key Points

1. **All database operations are now async** - Always use `await` when calling database methods
2. **Database must be initialized** - Call `initialize()` before using the database
3. **Graceful shutdown** - Call `close()` to properly close connections

## Testing

To verify the migration:

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Test the endpoints:
   ```bash
   # Check health
   curl http://localhost:3001/health
   
   # Get stats
   curl http://localhost:3001/api/stats
   
   # Ingest data
   curl -X POST http://localhost:3001/api/ingest
   
   # Build profiles
   curl -X POST http://localhost:3001/api/build-profiles
   
   # Detect anomalies
   curl -X POST http://localhost:3001/api/detect-anomalies
   
   # Get logs
   curl http://localhost:3001/api/logs
   ```

## Future Enhancements

With TypeORM in place, you can now easily:

1. **Add migrations**: Create version-controlled database schema changes
2. **Add relations**: Define relationships between DeviceLogs and UserProfiles
3. **Switch databases**: Easily migrate to PostgreSQL, MySQL, etc.
4. **Add decorators**: Convert to TypeScript and use decorator-based entities
5. **Add transactions**: Wrap multiple operations in database transactions

## Troubleshooting

### Issue: "Cannot read properties of null"
**Solution**: Ensure the database is initialized before making queries. The routes file now waits for initialization.

### Issue: "Database locked"
**Solution**: TypeORM handles connection pooling automatically. Ensure you're not creating multiple DatabaseManager instances.

### Issue: Migration from existing database
**Solution**: TypeORM's `synchronize: true` option will automatically update the schema. For production, disable this and use migrations.

## Resources

- [TypeORM Documentation](https://typeorm.io/)
- [TypeORM with SQLite](https://typeorm.io/#/connection-options/better-sqlite3-connection-options)
- [Repository API](https://typeorm.io/#/working-with-repository)

---

**Migration completed successfully! Issues #1 and #2 are now resolved.**
