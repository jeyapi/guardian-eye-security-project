# 🐳 GuardianEye - Installation Docker (Simple)

**Pour vos amis qui veulent tester sans installer Node.js, npm, etc.**

## 📋 Prérequis (Une seule chose !)

**Installer Docker Desktop :**
- **Windows/Mac** : [Télécharger Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux** : `sudo apt-get install docker-compose` ou [Documentation](https://docs.docker.com/engine/install/)

**C'est tout !** Pas besoin de Node.js, npm ou autres dépendances.

---

## 🚀 Démarrage Ultra-Rapide

### Option 1 : Script Automatique (Recommandé)

**Windows :**
```bash
start-docker.bat
```

**Linux/Mac :**
```bash
chmod +x start-docker.sh
./start-docker.sh
```

### Option 2 : Commande Manuelle

```bash
docker-compose up --build -d
```

**C'est tout !** Attendez 2-3 minutes pendant le premier lancement (téléchargement des images).

---

## 📱 Accéder à l'Application

Ouvrir le navigateur : **http://localhost:8080**

---

## 🛠️ Commandes Utiles

### Voir les logs
```bash
docker-compose logs -f
```

### Redémarrer les services
```bash
docker-compose restart
```

### Arrêter les services
```bash
docker-compose down
```

### Supprimer tout et recommencer
```bash
docker-compose down -v
docker-compose up --build -d
```

---

## 📦 Architecture Docker

```
┌─────────────────────────────────────┐
│   Frontend (React + Nginx)          │
│   Port: 8080                        │
│   http://localhost:8080             │
└──────────────┬──────────────────────┘
               │
          Proxy /api/
               │
               ▼
┌─────────────────────────────────────┐
│   Backend (Node.js + Express)       │
│   Port: 3001                        │
│   SQLite Database                   │
└─────────────────────────────────────┘
```

---

## 🔍 Dépannage

### Problème : Port déjà utilisé
**Solution :**
1. Modifier `docker-compose.yml` :
```yaml
frontend:
  ports:
    - "9090:80"  # Changer 8080 en 9090
```
2. Accéder à : http://localhost:9090

### Problème : Docker ne démarre pas
**Solution :**
1. Vérifier que Docker Desktop est lancé
2. Sur Windows, activer WSL2 si demandé
3. Redémarrer Docker Desktop

### Problème : Erreurs de build
**Solution :**
```bash
# Nettoyer et reconstruire
docker-compose down
docker system prune -f
docker-compose up --build
```

---

## 📊 Avantages Docker vs Installation Manuelle

| Critère | Docker | Installation Manuelle |
|---------|--------|----------------------|
| **Dépendances** | ✅ Aucune (juste Docker) | ❌ Node.js, npm, 100+ packages |
| **Temps Setup** | ✅ 2-3 minutes | ❌ 10-15 minutes |
| **Conflit Versions** | ✅ Isolé | ❌ Peut avoir des conflits |
| **Portabilité** | ✅ Marche partout | ❌ Dépend de l'OS |
| **Facilité** | ✅✅✅ Ultra simple | ❌ Technique |

---

## 🎯 Pour Partager avec Vos Amis

**Instructions en 3 étapes :**

1. **Installer Docker Desktop** → [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

2. **Télécharger le projet GuardianEye** (zip ou git clone)

3. **Double-cliquer sur `start-docker.bat`** (Windows) ou lancer `./start-docker.sh` (Linux/Mac)

**Et voilà !** L'application sera accessible sur http://localhost:8080

---

## 📄 Fichiers Docker Créés

```
guardian-eye-security-main/
├── docker-compose.yml          # Orchestre frontend + backend
├── Dockerfile                  # Build du frontend
├── nginx.conf                  # Configuration proxy
├── start-docker.bat            # Script Windows
├── start-docker.sh             # Script Linux/Mac
├── .dockerignore               # Exclusions build
└── backend/
    ├── Dockerfile              # Build du backend
    └── .dockerignore           # Exclusions build
```

---

## 🔒 Sécurité & Production

**Note :** Cette configuration Docker est pour **tests et développement**.

Pour la production, considérer :
- Variables d'environnement sécurisées
- HTTPS/SSL
- Base de données externe (PostgreSQL)
- Réduire les images (multi-stage builds optimisés)

---

## 💡 Support

**Pour toute question :**
- Voir les logs : `docker-compose logs -f`
- Vérifier l'état : `docker-compose ps`
- Documentation Docker : [docs.docker.com](https://docs.docker.com/)

---

**🎉 C'est tout ! Vos amis peuvent maintenant tester GuardianEye en quelques minutes sans se soucier des dépendances !**
