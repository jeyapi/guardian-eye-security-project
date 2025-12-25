# GuardianEye - AI-Powered Insider Threat Detection

Système de détection d'anomalies utilisant l'IA pour identifier les menaces internes à partir de 65k+ logs de connexions.

## Fonctionnalités

- **IA Isolation Forest** - Détection multi-dimensionnelle (6 features, 500k+ logs/sec)
- **Visualisations** - Graphiques de tendances, heatmap 7×24h, top utilisateurs, scores de risque
- **Export** - CSV/JSON avec filtres avancés
- **Recherche temps réel** - <50ms, filtres par sévérité et activité
- **Dashboard interactif** - Auto-refresh, progression animée

## Installation

### 1. Configuration

Créer `backend/.env`:
```env
DB_TYPE=postgres                                # postgres ou sqlite
PG_HOST=your-host.supabase.co                  # PostgreSQL host
PG_PASSWORD=your-password                       # Database password
PG_DATABASE=postgres
PG_SSL=true
PORT=3001
```

### 2. Démarrage

```bash
# Automatique
start.bat

# Manuel
cd backend && npm install && node server.js
cd .. && npm install && npm run dev
```

Accès: http://localhost:8080/dashboard

## Utilisation

**Workflow:**
1. **Ingest Data** - Charge 65,669 logs CSV
2. **Build Profiles** - Crée 228 profils utilisateurs  
3. **Detect Anomalies** - Analyse et détecte ~15 anomalies (0.02%)

**Visualisation:** Graphiques interactifs, heatmap, recherche/filtres temps réel, export CSV/JSON

## Stack Technique

**Backend:** Node.js, Express, TypeORM, PostgreSQL/SQLite, Isolation Forest IA  
**Frontend:** React, TypeScript, Vite, Recharts, Tailwind CSS, shadcn/ui

## Structure

```
backend/
├── src/
│   ├── entities/          # TypeORM entities (DeviceLog, UserProfile)
│   ├── routes/            # API endpoints
│   ├── database.js        # Gestionnaire TypeORM
│   ├── anomalyDetector.js # IA Isolation Forest
│   └── data-source.js     # Configuration DB
└── .env                   # Configuration

src/
├── pages/                 # Dashboard, Index
└── components/            # Charts, Filters, Export
```

## API

**Endpoints:** `/api/ingest` (POST), `/api/build-profiles` (POST), `/api/detect-anomalies` (POST), `/api/stats` (GET), `/api/logs` (GET), `/health` (GET)

Documentation complète: [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)

## Performance

- **Ingestion:** 15s (65k logs, PostgreSQL cloud)
- **Détection:** 1-2s (500k+ logs/sec)
- **Recherche:** <50ms
- **Batch insert:** 5000 records/batch

## Dépannage

**Port 3001 occupé:** `netstat -ano | findstr :3001`  
**Connexion PostgreSQL:** Vérifier `DB_TYPE=postgres`, credentials `.env`, `PG_SSL=true`  
**Pas de données:** Suivre les 3 étapes dans l'ordre (Ingest → Build → Detect)
