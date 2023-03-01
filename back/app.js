import express from "express";
import { sequelize } from "./db/db_init.js";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import url from "url";
import bcrypt from "bcrypt";
import "dotenv/config";
import { user } from "./db/sequelize.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reactionRoutes from "./routes/reactionRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import { createServer } from "http";
import { Server } from "socket.io";

/* Connexion et initialisation de la db avec un user admin génér automatiquement */
sequelize
  .sync()
  .then(async () => {
    console.log("Connexion à la BDD réussie");
    const findUserAdmin = await user.findOne({
      where: {
        isAdmin: true,
      },
    });
    if (!findUserAdmin) {
      // Pour éviter de recréer un user admin s'il y en a déjà un
      bcrypt.hash(process.env.ADMINPASSWORD, 10).then((hash) => {
        user.create({
          email: "admin@gmail.com",
          password: hash,
          firstname: "Modérateur",
          lastname: "Groupomania",
          username: "modérateur_groupomania",
          isAdmin: true,
          profilPicture: "http://localhost:3000/images/defaultPicture.png",
        });
      });
    }
  })
  .catch((error) => console.log(error));

/* Ces deux lignes sont obligatoires car la syntaxe ES6 est utilisée.*/
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Parse les données json et impose une limite de 50mb
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use("/api/users/", userRoutes);
app.use("/api/posts/", postRoutes);
app.use("/api/posts/", reactionRoutes);
app.use("/api/posts/", commentRoutes);
app.use("/api/users/", followRoutes);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  },
});

io.on("connection", (socket) => {
  console.log(`user ${socket.id} is connected`);
  socket.on("hello", (arg) => {
    console.log(arg); // world
  });
  socket.on("newPost", (arg) => {
    console.log(arg);
  });
});

httpServer.listen(process.env.PORT || 3000);
// app.listen(process.env.PORT || 3000);
