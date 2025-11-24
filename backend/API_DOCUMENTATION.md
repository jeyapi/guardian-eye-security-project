# GuardianEye Backend API Documentation

## Base URL
```
http://localhost:3001
```

## Overview
The GuardianEye backend provides endpoints for data ingestion, anomaly detection, and user profiling using SQLite as the database.

---

## Health Check

### GET /health
Check if the server is running.

**Response (200)**
```json
{
  "status": "ok",
  "message": "GuardianEye Backend is running"
}
```

---

## Data Ingestion

### POST /api/ingest
Ingest data from the CSV file located at `public/data/device.csv`.

**Response (200)**
```json
{
  "success": true,
  "message": "Data ingestion completed successfully. Inserted 65668 logs.",
  "stats": {
    "total": 65668,
    "anomalies": 0,
    "users": 228
  }
}
```

**Response (500)**
```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Statistics

### GET /api/stats
Get statistics about logs and anomalies.

**Response (200)**
```json
{
  "success": true,
  "stats": {
    "total": 65668,
    "anomalies": 0,
    "users": 228
  }
}
```

---

## Logs

### GET /api/logs
Get all logs or just anomalies.

**Query Parameters:**
- `anomalies` (optional): Set to "true" to get only anomalous logs

**Response (200)**
```json
{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "date": "2024-01-15T10:30:00Z",
      "user_name": "john.doe",
      "pc": "PC-001",
      "activity": "Login",
      "anomaly_score": 0.0,
      "is_anomaly": 0
    }
  ]
}
```

---

## User Profiles

### POST /api/build-profiles
Build user profiles from existing logs.

**Response (200)**
```json
{
  "success": true,
  "message": "User profiles built successfully. Created 228 profiles.",
  "count": 228
}
```

**Response (400)** (if no logs found)
```json
{
  "success": false,
  "message": "No logs found. Please ingest data first."
}
```

### GET /api/profiles
Get all user profiles.

**Response (200)**
```json
{
  "success": true,
  "data": [
    {
      "user_name": "john.doe",
      "total_activities": 150,
      "unique_pcs": 3,
      "common_activities": ["Login", "Logout", "File Access"],
      "common_pcs": ["PC-001", "PC-002"]
    }
  ]
}
```

---

## Anomaly Detection

### POST /api/detect-anomalies
Detect anomalies in logs using AI.

**Response (200)**
```json
{
  "success": true,
  "message": "Detected 15 anomalies out of 65668 logs.",
  "details": {
    "total": 65668,
    "anomalies": 15
  }
}
```

**Response (400)** (if no logs or profiles found)
```json
{
  "success": false,
  "message": "No logs found. Please ingest data first."
}
```
or
```json
{
  "success": false,
  "message": "No profiles found. Please build profiles first."
}
```

---

## Data Management

### DELETE /api/clear
Clear all data (for testing purposes).

**Response (200)**
```json
{
  "success": true,
  "message": "All data cleared successfully"
}
```

---

## Typical Workflow

1. **Ingest Data**: `POST /api/ingest`
2. **Build Profiles**: `POST /api/build-profiles`
3. **Detect Anomalies**: `POST /api/detect-anomalies`
4. **View Results**: `GET /api/logs?anomalies=true`

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request (missing required data) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Example Usage with PowerShell

### Health Check
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/health" -Method GET
```

### Ingest Data
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/ingest" -Method POST
```

### Get Statistics
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/stats" -Method GET
```

### Build Profiles
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/build-profiles" -Method POST
```

### Detect Anomalies
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/detect-anomalies" -Method POST
```

### Get Anomalous Logs
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/logs?anomalies=true" -Method GET
```

---

## Database
The backend uses SQLite (`guardian-eye.db`) for data persistence. The database contains:
- **logs**: All ingested log entries with anomaly scores
- **profiles**: User behavior profiles
