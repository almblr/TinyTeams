import { defineStore } from "pinia";
import { socket } from "../socket.js";
import axios from "axios";

const useUserStore = defineStore("user", {
  state: () => ({
    token: JSON.parse(sessionStorage.getItem(`token`)),
    users: [],
  }),
  actions: {
    async signup(data) {
      await axios({
        url: "http://localhost:3000/api/users/signup",
        method: "POST",
        data: JSON.stringify({
          email: data.email,
          password: data.password,
          firstname: data.firstname,
          lastname: data.lastname,
        }),
      });
      useUserStore().login(data);
    },
    async login(data) {
      try {
        const res = await axios({
          url: "http://localhost:3000/api/users/login",
          method: "POST",
          data: {
            email: data.email,
            password: data.password,
          },
        });
        socket.emit("sendUserId", res.data.loggedUser.id);
        sessionStorage.setItem("user", JSON.stringify(res.data.loggedUser));
        sessionStorage.setItem("token", JSON.stringify(res.data.token));
        this.token = res.data.token;
        return res.data;
      } catch (err) {
        return false;
      }
    },
    async getOne(username) {
      const res = await axios({
        url: `http://localhost:3000/api/users/getOne/${username}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return res.data;
    },
    async getAll(string, lastUserViewed) {
      const res = await axios({
        url: `http://localhost:3000/api/users/getAll/`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params: {
          search: string,
          lastUserId: lastUserViewed,
        },
      });
      if (Object.values(res.data).includes("No more users")) {
        return console.log("No more users to load");
      }
      this.users = res.data;
    },
    async update(data, userId) {
      await axios({
        url: `http://localhost:3000/api/users/update/${userId}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        data,
      });
    },
  },
});

export default useUserStore;
