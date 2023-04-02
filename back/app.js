import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import url from "url";
import bcrypt from "bcrypt";
import "dotenv/config";
import { sequelize } from "./db/db_init.js";
import { User } from "./db/sequelize.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reactionRoutes from "./routes/reactionRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();
const httpServer = createServer(app);

/* Ces deux lignes sont obligatoires car la syntaxe ES6 est utilisée.*/
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

/* Connexion et initialisation de la db avec un user admin génér automatiquement */
sequelize
  .sync()
  .then(async () => {
    console.log("Connexion à la BDD réussie");
    const findUserAdmin = await User.findOne({
      where: {
        isAdmin: true,
      },
    });
    if (!findUserAdmin) {
      // Pour éviter de recréer un user admin s'il y en a déjà un
      bcrypt.hash(process.env.ADMINPASSWORD, 10).then((hash) => {
        User.create({
          email: "admin@gmail.com",
          password: hash,
          firstname: "Modérateur",
          lastname: "TinyTeams",
          username: "modérateurtinyteams",
          isAdmin: true,
          profilePicture: "http://localhost:3000/images/moderator.png",
        });
      });
    }
  })
  .catch((error) => console.log(error));

app.use("/api/users/", userRoutes);
app.use("/api/posts/", postRoutes);
app.use("/api/posts/", reactionRoutes);
app.use("/api/posts/", commentRoutes);
app.use("/api/users/", followRoutes);
app.use("/api/notifications", notificationRoutes);

const sessionsMap = {};
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  },
});

io.on("connection", (socket) => {
  io.to(socket.id).emit("askForUserId");
  socket.on("sendUserId", (userId) => {
    console.log(`User ${socket.id} is connected and their ID is ${userId}`);
    if (userId) {
      sessionsMap[userId] = socket.id;
      console.log(sessionsMap);
    }
  });
  socket.on("newFollow", (arg) => {
    console.log(arg);
  });
  socket.on("newPost", async (postAuthor) => {
    // A terminer
    const follows = await fetch(
      `http://localhost:3000/api/users/follow/getAll/${postAuthor}`
    );
    for (const follow of follows) {
      io.to(
        sessionsMap[follow.author].emit(
          "notifPost",
          `${postAuthor} a publié un nouveau post !`
        )
      );
    }
  });
  socket.on("sendLike", (postInfos) => {
    const receiver = postInfos.author;
    io.to(sessionsMap[receiver]).emit(
      "message",
      "Quelqu'un a aimé votre post !"
    );
  });
  socket.on("sendFollow", async (followInfos) => {
    const receiver = followInfos.isFollowing;
    const author = await User.findOne({
      where: {
        id: followInfos.author,
      },
    });
    io.to(sessionsMap[receiver]).emit(
      "followNotification",
      `${author.firstname} ${author.lastname} vous suit !`
    );
  });
});
httpServer.listen(process.env.PORT || 3000);
// app.listen(process.env.PORT || 3000);
