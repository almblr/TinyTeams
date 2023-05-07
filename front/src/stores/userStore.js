import { ref } from "vue";
import { defineStore } from "pinia";
import { socket } from "../socket.js";
import axios from "axios";

const useUserStore = defineStore("user", () => {
  const token = ref(JSON.parse(sessionStorage.getItem("token")));
  const users = ref([]);
  const user = ref(null);

  const signup = async (data) => {
    await axios({
      url: "http://localhost:3000/api/users/signup",
      method: "POST",
      data: {
        email: data.email,
        password: data.password,
        firstname: data.firstname,
        lastname: data.lastname,
      },
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
      token.value = res.data.token;
      return res.data;
    } catch {
      return false;
    }
  };
  const getOne = async (userId) => {
    const res = await axios({
      url: `http://localhost:3000/api/users/getOne/${userId}`,
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    user.value = res.data;
    return res.data;
  };
  const getAll = async (string, lastUserViewed) => {
    const res = await axios({
      url: `http://localhost:3000/api/users/getAll/`,
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      params: {
        search: string,
        lastUserId: lastUserViewed,
      },
    });
    if (Object.values(res.data).includes("No more users")) {
      return console.log("No more users to load");
    }
    if (lastUserViewed) {
      users.value.push(...res.data);
      return res.data;
    }
    users.value = res.data;
    return res.data;
  };
  const update = async (data, userId) => {
    await axios({
      url: `http://localhost:3000/api/users/update/${userId}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      data,
    });
  };
  function $reset() {
    token.value = null;
    users.value = [];
  }

  return {
    token,
    users,
    user,
    login,
    signup,
    getOne,
    getAll,
    update,
    $reset,
  };
});

export default useUserStore;
