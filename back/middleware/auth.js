import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // On enlève l'espace et le Bearer pour récupérer que le token
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    const userAdmin = decodedToken.isAdmin;
    req.auth = { token: token, userId: userId, role: userAdmin }; // Enrichit la requête du front, est exploité dans les controllers
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};

export default auth;
