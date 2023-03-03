import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    const userRole = decodedToken.isAdmin;
    req.auth = { token: token, userId: userId, isAdmin: userRole };
    if (!req.auth.userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({ error: "User not connected." });
  }
};

export default auth;
