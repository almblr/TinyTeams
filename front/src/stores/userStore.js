import { defineStore } from "pinia";
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
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      useUserStore().login(data);
    },
    async login(data) {
      const res = await axios({
        url: "http://localhost:3000/api/users/login",
        method: "POST",
        data: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      sessionStorage.setItem("user", JSON.stringify(res.data.loggedUser));
      sessionStorage.setItem("token", JSON.stringify(res.data.token));
      this.token = res.data.token;
      return res.data;
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
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        data,
      });
    },
  },
});

export default useUserStore;
