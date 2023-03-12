import { user } from "../db/sequelize.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userCtrl = {
  create: async (req, res) => {
    // Check if password matches the required RegExp
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(req.body.password)) {
      return res
        .status(400)
        .json({ message: "The password is not strong enough." });
    }
    try {
      const hash = await bcrypt.hash(req.body.password, 10);
      await user.create({
        email: req.body.email,
        password: hash,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: (req.body.firstname + req.body.lastname).toLowerCase(),
        isAdmin: false,
      });
      res.status(201).json({ message: "User created successfully!" });
    } catch {
      res.status(500).send();
    }
  },
  login: async (req, res) => {
    try {
      const User = await user.findOne({
        where: {
          email: req.body.email,
        },
      });
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        User.password
      );
      if (!isPasswordValid && !User) {
        return res.status(404).json({ message: "User not found." });
      }
      const token = jwt.sign(
        { userId: User.id, isAdmin: User.isAdmin },
        process.env.TOKEN,
        { expiresIn: "3h" }
      );
      res.status(200).json({
        userId: User.id,
        isAdmin: User.isAdmin,
        firstname: User.firstname,
        lastname: User.lastname,
        username: User.username,
        profilPicture: User.profilPicture,
        token: token,
      });
    } catch {
      res.status(500).send();
    }
  },
  getOne: async (req, res) => {
    try {
      const User = await user.findOne({
        where: {
          username: req.params.username,
        },
        attributes: {
          exclude: ["password"],
        },
      });
      if (User) {
        res.status(201).send(User);
      } else {
        res.status(404).json({ eror: "User not found." });
      }
    } catch {
      res.status(500).send();
    }
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
    }).then(() => {
      res.status(200).json({ message: "User updated successfully!" });
    });
  },
};

export default userCtrl;
