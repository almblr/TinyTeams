import express from "express";
import { sequelize } from "./db/db_init.js";
import postsRoutes from "./routes/postsRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import reactionsRoutes from "./routes/reactionsRoutes.js";
import commentsRoutes from "./routes/commentsRoutes.js";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import url from "url";
import { user } from "./db/sequelize.js";
import bcrypt from "bcrypt";
import "dotenv/config";

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
          email: "admin@admin.com",
          password: hash,
          firstName: "Modérateur",
          lastName: "Groupomania",
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

app.use("/api/auth/", usersRoutes);
app.use("/api/posts/", postsRoutes);
app.use("/api/posts/", reactionsRoutes);
app.use("/api/posts/", commentsRoutes);

app.listen(process.env.PORT || 3000);
