# PostgreSQL Setup Guide

## Option 1: Cloud PostgreSQL (Recommandé - Gratuit)

### Supabase (Le plus facile)
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Cliquez sur "New Project"
4. Remplissez:
   - Project name: `guardian-eye`
   - Database Password: (choisissez un mot de passe fort)
   - Region: (choisissez la plus proche)
5. Attendez 2 minutes que le projet soit créé
6. Allez dans "Settings" → "Database"
7. Dans "Connection string" → "URI", copiez la connection string

### Render (Alternative)
1. Allez sur [render.com](https://render.com)
2. Créez un compte gratuit
3. Cliquez sur "New +" → "PostgreSQL"
4. Remplissez:
   - Name: `guardian-eye-db`
   - Database: `guardian_eye`
   - User: `guardian_user`
   - Region: (choisissez la plus proche)
   - Plan: Free
5. Cliquez sur "Create Database"
6. Copiez les informations de connexion

## Configuration

1. Ouvrez le fichier `.env` dans le dossier `backend/`

2. Modifiez les paramètres:

### Pour Supabase:
```env
DB_TYPE=postgres
PG_HOST=db.xxxxxxxxxxxxx.supabase.co
PG_PORT=5432
PG_USERNAME=postgres
PG_PASSWORD=votre_mot_de_passe
PG_DATABASE=postgres
PG_SSL=true
```

### Pour Render:
```env
DB_TYPE=postgres
PG_HOST=dpg-xxxxxxxxxxxxx.oregon-postgres.render.com
PG_PORT=5432
PG_USERNAME=guardian_user
PG_PASSWORD=le_mot_de_passe_fourni
PG_DATABASE=guardian_eye
PG_SSL=true
```

## Installation

1. Installez le driver PostgreSQL:
```bash
cd backend
npm install
```

2. Démarrez le serveur:
```bash
npm start
```

## Revenir à SQLite

Si vous voulez revenir à SQLite, modifiez `.env`:
```env
DB_TYPE=sqlite
```

## Avantages PostgreSQL

✅ **Performance**: Meilleur pour grandes quantités de données
✅ **Scalabilité**: Supporte des millions d'enregistrements
✅ **Concurrent**: Plusieurs utilisateurs simultanés
✅ **Production-ready**: Utilisé par les grandes entreprises
✅ **Gratuit en cloud**: Supabase et Render offrent des plans gratuits

## Option 2: Installation Locale PostgreSQL

Si vous voulez installer PostgreSQL localement:

### Windows:
1. Téléchargez depuis [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Utilisez l'installeur EDB
3. Suivez l'assistant d'installation
4. Notez le mot de passe postgres

Configuration `.env` pour local:
```env
DB_TYPE=postgres
PG_HOST=localhost
PG_PORT=5432
PG_USERNAME=postgres
PG_PASSWORD=votre_mot_de_passe
PG_DATABASE=guardian_eye
PG_SSL=false
```

## Vérification

Après configuration, le serveur devrait afficher:
```
🔄 Initializing TypeORM database...
📊 Using PostgreSQL database
✅ TypeORM Database initialized successfully
```

## Migration des données

Pour migrer vos données existantes de SQLite vers PostgreSQL:
1. Configurez PostgreSQL dans `.env`
2. Redémarrez le serveur (les tables seront créées automatiquement)
3. Réingérez vos données avec `/api/ingest`

## Support

- Supabase: [supabase.com/docs](https://supabase.com/docs)
- Render: [render.com/docs/databases](https://render.com/docs/databases)
- PostgreSQL: [postgresql.org/docs](https://www.postgresql.org/docs/)
