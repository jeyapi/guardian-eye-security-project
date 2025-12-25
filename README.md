# GuardianEye - AI-Powered Insider Threat Detection

Anomaly detection system using AI to identify insider threats from 65k+ connection logs.

## Features

- **Isolation Forest AI** - Multi-dimensional detection (6 features, 500k+ logs/sec)
- **Visualizations** - Trend charts, 7×24h heatmap, top users, risk scores
- **Export** - CSV/JSON with advanced filters
- **Real-time search** - <50ms, severity and activity filters
- **Interactive dashboard** - Auto-refresh, animated progress

## Installation

### 1. Configuration

Create `backend/.env`:
```env
DB_TYPE=postgres                                # postgres or sqlite
PG_HOST=your-host.supabase.co                  # PostgreSQL host
PG_PASSWORD=your-password                       # Database password
PG_DATABASE=postgres
PG_SSL=true
PORT=3001
```

### 2. Start

```bash
# Automatic
start.bat

# Manual
cd backend && npm install && node server.js
cd .. && npm install && npm run dev
```

Access: http://localhost:8080/dashboard

## Usage

**Workflow:**
1. **Ingest Data** - Load 65,669 CSV logs
2. **Build Profiles** - Create 228 user profiles  
3. **Detect Anomalies** - Analyze and detect ~15 anomalies (0.02%)

**Visualization:** Interactive charts, heatmap, real-time search/filters, CSV/JSON export

## Tech Stack

**Backend:** Node.js, Express, TypeORM, PostgreSQL/SQLite, Isolation Forest AI  
**Frontend:** React, TypeScript, Vite, Recharts, Tailwind CSS, shadcn/ui

## Structure

```
backend/
├── src/
│   ├── entities/          # TypeORM entities (DeviceLog, UserProfile)
│   ├── routes/            # API endpoints
│   ├── database.js        # TypeORM manager
│   ├── anomalyDetector.js # Isolation Forest AI
│   └── data-source.js     # DB configuration
└── .env                   # Configuration

src/
├── pages/                 # Dashboard, Index
└── components/            # Charts, Filters, Export
```

## API

**Endpoints:** `/api/ingest` (POST), `/api/build-profiles` (POST), `/api/detect-anomalies` (POST), `/api/stats` (GET), `/api/logs` (GET), `/health` (GET)

Full documentation: [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)

## Performance

- **Ingestion:** 15s (65k logs, PostgreSQL cloud)
- **Detection:** 1-2s (500k+ logs/sec)
- **Search:** <50ms
- **Batch insert:** 5000 records/batch

## Troubleshooting

**Port 3001 in use:** `netstat -ano | findstr :3001`  
**PostgreSQL connection:** Check `DB_TYPE=postgres`, credentials in `.env`, `PG_SSL=true`  
**No data:** Follow the 3 steps in order (Ingest → Build → Detect)
