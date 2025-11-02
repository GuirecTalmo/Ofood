require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const debug = require("debug")("Index");
const app = express();

// Export app pour les middlewares qui en ont besoin
exports.app = app;

// Security headers
app.use(helmet());

// Compression
app.use(compression());

// HTTP request logger
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate limiting pour les endpoints critiques
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max
  message: "Trop de tentatives de connexion, réessayez dans 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // 3 inscriptions max par heure
  message: "Trop de tentatives d'inscription, réessayez dans 1 heure",
  standardHeaders: true,
  legacyHeaders: false,
});

// A réactiver pour gestion token par cookie
//permet de positionner sur l'objet req une clé coockie (si il existe)
//app.use(cookieParser())
//a placer absolument après cookieParser, sinon on aura un pb de lecture de la clé cookies à l'interieur !
//on execute ( applique )ici la cette couche jwt.
//require('./middlewares/jwt_cookie');

app.use(express.json());

// Appliquer rate limiting sur les routes critiques
const router = require("./routes");
app.use("/api/users/login", loginLimiter);
app.use("/api/users/signup", signupLimiter);
app.use(router);

if (process.env.DOCKER_ENV === "true") {
  const server = app.listen(80);
} else {
  const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => {
    debug(`Server listening on http://localhost:${PORT}`);
  });
}
