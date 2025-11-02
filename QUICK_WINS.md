# 🚀 QUICK WINS - Guide d'Action Rapide

## ⚡ Corrections en <2h (Priorité MAXIMALE)

### 1. 🔴 JWT Secret Hardcodé (15 min)

**Fichier**: `api/src/controllers/user.controller.js`

**AVANT**:
```javascript
token: jwt.sign({userId:result.id}, 'RANDOM_TOKEN_SECRET', {expiresIn:'24h'})
```

**APRÈS**:
```javascript
const env = require(`../env/${process.env.NODE_ENV}`);
const secret = env.JWT_SECRET;

token: jwt.sign({userId:result.id}, secret, {expiresIn:'24h'})
```

**Fichier**: `api/src/middlewares/auth_local_storage.js:46`

**AVANT**:
```javascript
const decodedToken=jwt.verify(token,'RANDOM_TOKEN_SECRET')
```

**APRÈS**:
```javascript
const env = require(`../env/${process.env.NODE_ENV}`);
const secret = env.JWT_SECRET;
const decodedToken=jwt.verify(token, secret)
```

---

### 2. 🔴 JWT Expiration (15 min)

**Fichier**: `api/src/middlewares/jwt_cookie.js:21,50`

**AVANT**:
```javascript
exp: Math.floor(Date.now() / 1000) + 5  // 5 secondes !
let decodedToken = jwt.verify(token, secret, { ignoreExpiration: true });
```

**APRÈS**:
```javascript
exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)  // 24h
let decodedToken = jwt.verify(token, secret);  // Pas d'ignoreExpiration
```

---

### 3. 🟠 CORS Configuration (30 min)

**Fichier**: `api/src/index.js:10-18`

**AVANT**:
```javascript
// const cors = require('cors');
// app.use(cors(corsOptions));
```

**APRÈS**:
```javascript
const cors = require('cors');
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

Ajouter dans `api/.env`:
```
FRONTEND_URL=http://localhost:3000
```

---

### 4. 🟠 Rate Limiting (1h)

**Fichier**: `api/src/index.js`

**1. Installer le package**:
```bash
cd api
npm install express-rate-limit
```

**2. Ajouter le middleware**:
```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max
  message: 'Trop de tentatives de connexion, réessayez dans 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // 3 inscriptions max par heure
  message: 'Trop de tentatives d\'inscription, réessayez dans 1 heure',
});

app.use('/api/users/login', loginLimiter);
app.use('/api/users/signup', signupLimiter);
```

---

### 5. 🟠 Helmet (30 min)

**1. Installer le package**:
```bash
cd api
npm install helmet
```

**2. Ajouter dans `api/src/index.js`**:
```javascript
const helmet = require('helmet');
app.use(helmet());
```

---

### 6. 🟡 .gitignore (15 min)

**Créer `.gitignore` à la racine**:
```gitignore
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment
.env
.env.local
.env.*.local
api/.env
client/.env

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build
dist/
build/
client/dist/

# IDE
.vscode/
.idea/
*.swp
*.swo
*.sublime-project
*.sublime-workspace

# OS
.DS_Store
Thumbs.db
*.tmp

# Docker
.docker/
docker-compose.override.yml

# Testing
coverage/
.nyc_output/

# Misc
.cache/
*.pid
*.seed
*.pid.lock
```

---

### 7. 🟡 .env.example (15 min)

**Créer `api/.env.example`**:
```env
# Server
NODE_ENV=pg_conf
PORT=3001
DOCKER_ENV=false

# PostgreSQL Dev
POSTGRES_USER=ofood
POSTGRES_PASSWORD=change_me_in_production
POSTGRES_DB=ofood
POSTGRES_HOST=postgresql
POSTGRES_PORT=5432

# PostgreSQL Prod (si heroku)
POSTGRES_HOST=your-heroku-host
# ... autres vars

# JWT
JWT_SECRET=change_me_to_a_strong_secret_minimum_32_characters_long

# Frontend
FRONTEND_URL=http://localhost:3000
```

---

### 8. 🟡 Credentials PostgreSQL (30 min)

**Fichier**: `docker-compose.dev.yml`

**AVANT**:
```yaml
postgresql:
  environment:
    - POSTGRES_USER=ofood
    - POSTGRES_PASSWORD=ofoodpassword
    - POSTGRES_DB=ofood
```

**APRÈS**:
```yaml
postgresql:
  environment:
    - POSTGRES_USER=${POSTGRES_USER:-ofood}
    - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    - POSTGRES_DB=${POSTGRES_DB:-ofood}
```

**Créer `.env` à la racine** (à ne PAS commiter):
```env
POSTGRES_USER=ofood
POSTGRES_PASSWORD=ofoodpassword  # Changer en prod
POSTGRES_DB=ofood
```

Ajouter au `.gitignore`:
```
.env
```

---

### 9. 🟡 Gestion d'Erreurs Prod (30 min)

**Fichier**: `api/src/middlewares/handleError.js:31`

**AVANT**:
```javascript
res.status(myError.status).json(myError.message);
```

**APRÈS**:
```javascript
// Ne pas exposer le message d'erreur détaillé en production
const isProduction = process.env.NODE_ENV === 'production';
const errorResponse = isProduction
  ? {
      error: 'Une erreur est survenue',
      status: myError.status
    }
  : {
      error: myError.message,
      status: myError.status,
      stack: myError.stack
    };

res.status(myError.status).json(errorResponse);
```

---

### 10. 🟡 Requêtes SQL Paramétrées (30 min)

**Fichier**: `api/src/database/models/users.datamapper.js:121`

**AVANT**:
```javascript
async GetUsers(){
  const query = `SELECT * FROM "users";`;
  const results = await client.query(query);
```

**APRÈS**:
```javascript
async GetUsers(){
  const query = {
    text: `SELECT * FROM "users";`,
    values: []
  };
  const results = await client.query(query);
```

**Fichier**: `api/src/database/models/recipes.datamapper.js:8`

**AVANT**:
```javascript
async getAllRecipes() {
  const query = "SELECT * FROM recipes;";
  const results = await client.query(query);
```

**APRÈS**:
```javascript
async getAllRecipes() {
  const query = {
    text: "SELECT * FROM recipes;",
    values: []
  };
  const results = await client.query(query);
```

---

## 📋 Checklist Quick Wins

- [ ] 1. JWT Secret corrigé
- [ ] 2. JWT Expiration corrigée
- [ ] 3. CORS configuré
- [ ] 4. Rate Limiting ajouté
- [ ] 5. Helmet installé
- [ ] 6. .gitignore créé
- [ ] 7. .env.example créé
- [ ] 8. Credentials PostgreSQL sécurisés
- [ ] 9. Gestion d'erreurs améliorée
- [ ] 10. Requêtes SQL paramétrées

**Temps total estimé**: 4-5h  
**Impact**: 🔴 3 Blockers + 🟠 5 Critical résolus

---

## 🎯 Ordre d'Exécution Recommandé

1. **JWT Secret** (15 min) → 🔴 Blocker #1
2. **JWT Expiration** (15 min) → 🔴 Blocker #2
3. **Requêtes SQL** (30 min) → 🔴 Blocker #3
4. **Rate Limiting** (1h) → 🟠 Critical
5. **CORS** (30 min) → 🟠 Critical
6. **Helmet** (30 min) → 🟡 Important
7. **.gitignore + .env.example** (30 min) → 🟡 Important
8. **Credentials PostgreSQL** (30 min) → 🟡 Important
9. **Gestion d'erreurs** (30 min) → 🟡 Important

**Total**: ~4h pour résoudre tous les Quick Wins !

