# 🍽️ O_FOOD - Application Web de Recettes Personnalisées

Application web React/Node.js/PostgreSQL permettant de générer des recettes personnalisées selon les intolérances alimentaires et l'IMC de l'utilisateur.

## 📋 Stack Technique

- **Frontend**: React 17 + SCSS + Webpack
- **Backend**: Node.js + Express + PostgreSQL
- **Containerisation**: Docker + Docker Compose
- **Reverse Proxy**: Nginx

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** >= 14.x
- **npm** >= 6.x
- **PostgreSQL** >= 12.x (si installation locale)
- **Docker** >= 20.x (optionnel, pour Docker Compose)
- **Docker Compose** >= 1.29.x (optionnel)

### Option 1 : Installation Locale (Sans Docker)

#### 1. Cloner le repository

```bash
git clone <repository-url>
cd Ofood
```

#### 2. Configuration de la base de données PostgreSQL

**Installer PostgreSQL** (si non installé) :

- **Windows** : [Télécharger PostgreSQL](https://www.postgresql.org/download/windows/)
- **macOS** : 
  ```bash
  brew install postgresql
  brew services start postgresql
  ```
- **Linux (Ubuntu/Debian)** :
  ```bash
  sudo apt-get update
  sudo apt-get install postgresql postgresql-contrib
  sudo systemctl start postgresql
  ```

**Créer la base de données** :

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données et l'utilisateur
CREATE DATABASE ofood;
CREATE USER ofood WITH PASSWORD 'ofoodpassword';
ALTER DATABASE ofood OWNER TO ofood;
GRANT ALL PRIVILEGES ON DATABASE ofood TO ofood;
\q
```

#### 3. Configuration de l'API

```bash
# Aller dans le dossier API
cd api

# Installer les dépendances
npm install

# Copier le fichier .env.example vers .env
cp .env.example .env

# Éditer le fichier .env avec vos configurations
# IMPORTANT : Modifier JWT_SECRET et POSTGRES_PASSWORD
```

**Contenu de `api/.env`** :

```env
NODE_ENV=pg_conf
PORT=3001
DOCKER_ENV=false

# PostgreSQL
POSTGRES_USER=ofood
POSTGRES_PASSWORD=ofoodpassword  # À changer en production
POSTGRES_DB=ofood
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# JWT Secret (GÉNÉRER UN SECRET FORT - MINIMUM 32 CARACTÈRES)
JWT_SECRET=votre_secret_jwt_super_long_et_securise_ici_min_32_chars

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### 4. Exécuter les migrations de base de données

```bash
# Depuis la racine du projet
cd migration

# Exécuter les migrations (selon votre système de migration)
# Exemple avec sqitch ou scripts SQL
# Vérifier le dossier migration/deploy pour les scripts SQL
```

**Ou exécuter manuellement les scripts SQL** :

```bash
# Se connecter à PostgreSQL
psql -U ofood -d ofood

# Exécuter les scripts dans l'ordre :
# 1. migration/deploy/1.init.sql
# 2. migration/deploy/2.add.seeding.sql
# 3. migration/deploy/3.add.script_create_meals.sql
# etc.
```

#### 5. Démarrer l'API

```bash
cd api
npm start
# L'API sera accessible sur http://localhost:3001
```

#### 6. Configuration du Frontend

```bash
# Ouvrir un nouveau terminal
cd client

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
# Le frontend sera accessible sur http://localhost:3000
```

---

### Option 2 : Installation avec Docker (Recommandé)

#### 1. Installer Docker

**Windows** :
- Télécharger [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Installer et redémarrer

**macOS** :
```bash
brew install --cask docker
# Ou télécharger depuis https://www.docker.com/products/docker-desktop
```

**Linux (Ubuntu/Debian)** :
```bash
# Installation de Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER
# Redémarrer ou se déconnecter/reconnecter

# Installation de Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Vérifier l'installation
docker --version
docker-compose --version
```

#### 2. Cloner le repository

```bash
git clone <repository-url>
cd Ofood
```

#### 3. Configuration de l'environnement

```bash
# Créer le fichier .env à la racine
touch .env

# Éditer .env avec vos configurations
```

**Contenu de `.env`** (à la racine) :

```env
# PostgreSQL
POSTGRES_USER=ofood
POSTGRES_PASSWORD=change_me_in_production  # IMPORTANT : Changer en production
POSTGRES_DB=ofood

# JWT Secret (GÉNÉRER UN SECRET FORT - MINIMUM 32 CARACTÈRES)
JWT_SECRET=votre_secret_jwt_super_long_et_securise_ici_min_32_chars

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

```bash
# Configurer aussi api/.env
cd api
cp .env.example .env
# Éditer api/.env avec les mêmes valeurs
```

#### 4. Créer le volume Docker pour PostgreSQL

```bash
docker volume create db_prod_postgres_ofood
```

#### 5. Démarrer les services avec Docker Compose

```bash
# Depuis la racine du projet
docker-compose -f docker-compose.dev.yml up --build
```

**Ou en arrière-plan** :

```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

#### 6. Accéder à l'application

- **Frontend** : http://localhost:3000
- **API** : http://localhost:80/api
- **PostgreSQL** : localhost:54320

#### 7. Vérifier les logs

```bash
# Voir tous les logs
docker-compose -f docker-compose.dev.yml logs -f

# Voir les logs d'un service spécifique
docker-compose -f docker-compose.dev.yml logs -f api
docker-compose -f docker-compose.dev.yml logs -f client
docker-compose -f docker-compose.dev.yml logs -f postgresql
```

#### 8. Arrêter les services

```bash
# Arrêter les conteneurs
docker-compose -f docker-compose.dev.yml down

# Arrêter et supprimer les volumes (⚠️ Supprime les données)
docker-compose -f docker-compose.dev.yml down -v
```

---

## 🔧 Commandes Utiles

### Développement API

```bash
cd api

# Démarrer en mode développement
npm start

# Démarrer avec debug
npm run dev_debug

# Production avec PM2
npm run prod
```

### Développement Frontend

```bash
cd client

# Démarrer le serveur de développement
npm start

# Build de production
npm run build

# Linter
npm run lint
npm run lint:fix
```

### Docker

```bash
# Rebuild les images
docker-compose -f docker-compose.dev.yml build

# Redémarrer un service spécifique
docker-compose -f docker-compose.dev.yml restart api

# Accéder au shell d'un conteneur
docker-compose -f docker-compose.dev.yml exec api sh
docker-compose -f docker-compose.dev.yml exec postgresql psql -U ofood -d ofood

# Nettoyer les ressources Docker
docker-compose -f docker-compose.dev.yml down
docker system prune -a  # ⚠️ Supprime toutes les images non utilisées
```

### Base de données

```bash
# Se connecter à PostgreSQL (local)
psql -U ofood -d ofood

# Se connecter à PostgreSQL (Docker)
docker-compose -f docker-compose.dev.yml exec postgresql psql -U ofood -d ofood

# Backup de la base de données
docker-compose -f docker-compose.dev.yml exec postgresql pg_dump -U ofood ofood > backup.sql

# Restore de la base de données
docker-compose -f docker-compose.dev.yml exec -T postgresql psql -U ofood ofood < backup.sql
```

---

## 📁 Structure du Projet

```
Ofood/
├── api/                      # Backend Node.js/Express
│   ├── src/
│   │   ├── controllers/      # Controllers
│   │   ├── database/         # Models & DataMappers
│   │   ├── middlewares/      # Middlewares Express
│   │   ├── routes/           # Routes API
│   │   ├── validation/       # Schemas de validation (Joi)
│   │   └── index.js          # Point d'entrée
│   ├── Dockerfile.dev
│   ├── package.json
│   └── .env.example
│
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/       # Composants React
│   │   ├── services/         # Services API
│   │   └── styles/          # SCSS
│   ├── config/               # Configuration Webpack
│   ├── Dockerfile.dev
│   └── package.json
│
├── migration/                 # Scripts SQL de migration
│   ├── deploy/               # Migrations
│   └── revert/               # Rollbacks
│
├── reverse-proxy/             # Configuration Nginx
│   └── conf/
│
├── docker-compose.dev.yml     # Configuration Docker Compose
├── .gitignore
├── .dockerignore
└── README.md
```

---

## 🔐 Sécurité

### ⚠️ IMPORTANT : Avant la mise en production

1. **Changer tous les secrets** dans `.env` :
   - `JWT_SECRET` : Générer un secret fort (minimum 32 caractères)
   - `POSTGRES_PASSWORD` : Mot de passe fort pour la base de données

2. **Générer un JWT_SECRET sécurisé** :
   ```bash
   # Linux/macOS
   openssl rand -base64 32
   
   # Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

3. **Mettre à jour les dépendances** :
   ```bash
   cd api
   npm audit fix
   ```

4. **Configurer CORS** pour l'URL de production dans `api/.env` :
   ```env
   FRONTEND_URL=https://votre-domaine.com
   ```

5. **Activer SSL** pour PostgreSQL en production

---

## 🐛 Dépannage

### L'API ne démarre pas

- Vérifier que PostgreSQL est démarré et accessible
- Vérifier les variables d'environnement dans `api/.env`
- Vérifier les logs : `docker-compose logs api`

### Erreur de connexion à PostgreSQL

- Vérifier que PostgreSQL est démarré
- Vérifier les credentials dans `.env`
- Vérifier que le port 5432 (ou 54320 avec Docker) n'est pas utilisé

### Erreur CORS

- Vérifier `FRONTEND_URL` dans `api/.env`
- Vérifier que le frontend utilise la bonne URL API

### Port déjà utilisé

- Changer le port dans `api/.env` (PORT=3002)
- Ou arrêter le service utilisant le port

---

## 📚 Documentation API

Voir `api/docs/API_Endpoints.md` pour la documentation complète des endpoints.

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

ISC

---

## 👥 Équipe

Équipe de développement O_FOOD

---

**Dernière mise à jour** : Décembre 2024

