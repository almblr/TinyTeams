import { defineStore } from "pinia";
import axios from "axios";

const useNotifStore = defineStore("notif", {
  state: () => ({
    token: JSON.parse(sessionStorage.getItem(`token`)),
    notifs: [],
  }),
  actions: {
    async getOne(notifId) {
      const res = await axios({
        url: `http://localhost:3000/api/notifications/getOne/${notifId}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      const notif = await res.data;
      const foundNotif = this.notifs.find((notif) => notif.id === notifId);
      const index = this.notifs.indexOf(foundNotif);
      this.notifs.splice(index, 1, notif);
    },
    async getAll(userId, lastnotifViewed) {
      let url = `http://localhost:3000/api/notifications/getAll/${userId}`;
      const res = await axios({
        url,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params: {
          lastNotifId: lastnotifViewed,
        },
      });
      if (Object.values(res.data).includes("No more notifs")) {
        return console.log("No more notifs to load");
      }
      this.notifs = res.data;
    },
    async create(data) {
      const res = await axios({
        url: "http://localhost:3000/api/notifications/create",
        method: "notif",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        data,
      });
      this.notifs.unshift(res.data);
      return res.data;
    },
  },
});

export default useNotifStore;
