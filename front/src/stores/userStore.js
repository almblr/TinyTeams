import { ref } from "vue";
import { defineStore } from "pinia";
import { socket } from "../socket.js";
import axios from "axios";

export const useUserStore = defineStore("user", () => {
  const token = JSON.parse(sessionStorage.getItem(`token`));
  const users = ref([]);

  const signup = async (data) => {
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
    login(data);
  };
  const login = async (data) => {
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
      return res.data;
    } catch (err) {
      return false;
    }
  };
  const getOne = async (username) => {
    const res = await axios({
      url: `http://localhost:3000/api/users/getOne/${username}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };
  const getAll = async (string, lastUserViewed) => {
    const res = await axios({
      url: `http://localhost:3000/api/users/getAll/`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        search: string,
        lastUserId: lastUserViewed,
      },
    });
    if (Object.values(res.data).includes("No more users")) {
      return console.log("No more users to load");
    }
    users.value = res.data;
  };
  const update = async (data, userId) => {
    await axios({
      url: `http://localhost:3000/api/users/update/${userId}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    });
  };

  return {
    users,
    login,
    signup,
    getOne,
    getAll,
    update,
  };
});
