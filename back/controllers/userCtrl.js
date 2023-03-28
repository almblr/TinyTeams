import { Op } from "sequelize";
import { user } from "../db/sequelize.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userController = {
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
        return res.status(404).json({ message: "User not found" });
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
        job: User.job,
        email: User.email,
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
        res.status(404).json({ eror: "User not found" });
      }
    } catch {
      res.status(500).send();
    }
  },
  getAll: async (req, res) => {
    try {
      const Users = await user.findAll({
        where: req.query.search
          ? {
              [Op.or]: [
                {
                  firstname: {
                    [Op.like]: "%" + req.query.search + "%",
                  },
                },
                {
                  lastname: {
                    [Op.like]: "%" + req.query.search + "%",
                  },
                },
              ],
            }
          : {},
        order: [["firstname", "ASC"]],
        attributes: [
          "id",
          "firstname",
          "lastname",
          "username",
          "job",
          "profilPicture",
          "isAdmin",
        ],
      });
      if ("lastUserId" in req.query) {
        const lastUser = Users.findIndex(
          (user) => user.id === parseInt(req.query.lastUserId)
        );
        if (lastUser === -1) {
          console.log("User not found");
          return res.status(400).send({ message: "User not found" });
        }
        const start = lastUser + 1;
        const end = start + 10;
        const nextUsers = Users.slice(start, end);
        if (nextUsers.length === 0) {
          return res.status(200).send({ message: "No more users" });
        }
        if (start + 1 === Users.length) {
          return res.status(200).send(Users.slice(start, Users.length));
        }
        return res.status(200).send(nextUsers);
      }
      res.status(200).send(Users.slice(0, 10));
    } catch {
      res.status(500).send();
    }
  },
  update: async (req, res) => {
    const User = await user.findByPk(req.params.userId);
    if (req.body.newPassword && req.body.oldPassword) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(req.body.newPassword)) {
        return res
          .status(400)
          .json({ message: "The new password is not strong enough" });
      }
      const isPasswordValid = await bcrypt.compare(
        req.body.oldPassword,
        User.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Wrong password" });
      }
    }
    const updatedUser = {
      email: req.body.newEmail || User.email,
      password: req.body.newPassword
        ? await bcrypt.hash(req.body.newPassword, 10)
        : User.password,
      profilPicture: req.body.profilPicture || User.profilPicture,
      job: req.body.job || User.job,
    };
    await User.update(updatedUser);
    res.status(200).json({ message: "User updated successfully" });
  },
};

export default userController;
