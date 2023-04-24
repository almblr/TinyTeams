import { Op } from "sequelize";
import { User } from "../db/sequelize.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userController = {
  create: async (req, res) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(req.body.password)) {
      return res
        .status(400)
        .json({ message: "The password is not strong enough." });
    }
    try {
      const hash = await bcrypt.hash(req.body.password, 10);
      await User.create({
        email: req.body.email,
        password: hash,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        isAdmin: false,
        job: req.body.job,
      });
      res.status(201).json({ message: "User created successfully!" });
    } catch {
      res.status(500).send();
    }
  },
  login: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email,
        },
      });
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      !isPasswordValid
        ? res.status(404).json({ message: "User not found" })
        : null;
      const token = jwt.sign(
        { userId: user.id, isAdmin: user.isAdmin },
        process.env.TOKEN,
        { expiresIn: "3h" }
      );
      const loggedUser = {
        id: user.id,
        isAdmin: user.isAdmin,
        firstname: user.firstname,
        lastname: user.lastname,
        profilePicture: user.profilePicture,
        job: user.job,
        email: user.email,
      };
      res.status(200).json({ loggedUser, token });
    } catch {
      res.status(500).send();
    }
  },
  getOne: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          id: req.params.userId,
        },
        attributes: {
          exclude: ["password"],
        },
      });
      user
        ? res.status(201).send(user)
        : res.status(404).json({ eror: "User not found" });
    } catch {
      res.status(500).send();
    }
  },
  getAll: async (req, res) => {
    try {
      const users = await User.findAll({
        where: {
          [Op.and]: [
            req.query.search
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
                    {
                      job: {
                        [Op.like]: "%" + req.query.search + "%",
                      },
                    },
                  ],
                }
              : {},
            // On exclut l'utilisateur connecté de la liste
            {
              id: {
                [Op.ne]: req.auth.userId,
              },
            },
          ],
        },
        order: [["firstname", "ASC"]],
        attributes: [
          "id",
          "firstname",
          "lastname",
          "job",
          "profilePicture",
          "isAdmin",
        ],
      });
      if ("lastUserId" in req.query) {
        const lastUser = users.findIndex(
          (user) => user.id === parseInt(req.query.lastUserId)
        );
        if (lastUser === -1) {
          console.log("User not found");
          return res.status(400).send({ message: "User not found" });
        }
        const start = lastUser + 1;
        const end = start + 10;
        const nextUsers = users.slice(start, end);
        if (nextUsers.length === 0) {
          return res.status(200).send({ message: "No more users" });
        }
        if (start + 1 === users.length) {
          return res.status(200).send(users.slice(start, users.length));
        }
        return res.status(200).send(nextUsers);
      }
      res.status(200).send(users.slice(0, 10));
    } catch {
      res.status(500).send();
    }
  },
  update: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.userId);
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
          user.password
        );
        !isPasswordValid
          ? res.status(404).json({ message: "Wrong password" })
          : null;
      }
      const updatedUser = {
        email: req.body.email || user.email,
        password: req.body.newPassword
          ? await bcrypt.hash(req.body.newPassword, 10)
          : user.password,
        profilePicture: req.files?.profilePicture
          ? `${req.protocol}://${req.get("host")}/images/${
              req.files.profilePicture[0].filename
            }`
          : user.profilePicture,
        job: req.body.job || user.job,
      };
      await user.update(updatedUser);
      res.status(200).json({ message: "User updated successfully" });
    } catch {
      res.status(500).json();
    }
  },
};

export default userController;
