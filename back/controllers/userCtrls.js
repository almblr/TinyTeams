import { user } from "../db/sequelize.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userController = {
  signup: (req, res) => {
    // Check if password matches the required RegExp
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(req.body.password)) {
      return res
        .status(400)
        .json({ message: "The password is not strong enough." });
    }
    // Hash the password
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        // Create the user
        return user.create({
          email: req.body.email,
          password: hash,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          isAdmin: req.body.isAdmin,
          profilPicture: "http://localhost:3000/images/defaultPicture.png",
        });
      })
      .then(() => {
        res.status(201).json({ message: "User created successfully!" });
      })
      .catch((error) => {
        res
          .status(400)
          .json({ message: "Failed to create user: " + error.message });
      });
  },
  login: (req, res) => {
    // Find the user by email
    user
      .findOne({
        where: {
          email: req.body.email,
        },
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }

        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({ message: "User not found." });
            }
            // Create a JSON Web Token
            const token = jwt.sign(
              { userId: user.id, isAdmin: user.isAdmin },
              process.env.TOKEN,
              { expiresIn: "3h" }
            );
            // Return the user's information and the JWT
            res.status(200).json({
              userId: user.id,
              isAdmin: user.isAdmin,
              userName: `${user.firstName} ${user.lastName}`,
              profilPicture: user.profilPicture,
              token: token,
            });
          })
          .catch((error) => {
            // Return an error if there was a problem comparing the passwords
            res
              .status(400)
              .json({ message: "Failed to login: " + error.message });
          });
      })
      .catch((error) => {
        // Return an error if there was a problem finding the user
        res.status(500).json({ message: "Failed to login: " + error.message });
      });
  },
  update: async (req, res) => {
    // Check if the new email address is valid (if provided)
    if (
      req.body.newEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.newEmail)
    ) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    // Check if the new password matches the required RegExp (if provided)
    if (req.body.newPassword) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(req.body.newPassword)) {
        return res
          .status(400)
          .json({ message: "The new password is not strong enough." });
      }
    }
    const User = await user.findByPk(req.params.id);
    // Update the user's information
    User.update({
      email: req.body.newEmail ? req.body.newEmail : User.email,
      password: req.body.newPassword ? req.body.newPassword : User.email,
      profilPicture: req.body.profilPicture
        ? req.body.profilPicture
        : User.profilPicture,
    })
      .then(() => {
        res.status(200).json({ message: "User updated successfully!" });
      })
      .catch((error) => {
        res
          .status(400)
          .json({ message: "Failed to update user: " + error.message });
      });
  },
};

export default userController;
