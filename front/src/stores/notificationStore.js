import { defineStore } from "pinia";
import axios from "axios";

const useNotifStore = defineStore("notif", {
  state: () => ({
    token: JSON.parse(sessionStorage.getItem(`token`)),
    userId: JSON.parse(sessionStorage.getItem(`user`)).id,
    notifs: [],
    nonViewedNotifs: 0,
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
    async getAll(lastNotifViewed) {
      let url = `http://localhost:3000/api/notifications/getAll/${this.userId}`;
      const res = await axios({
        url,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params: {
          lastNotifId: lastNotifViewed,
        },
      });
      if (Object.values(res.data).includes("No more notifications")) {
        return console.log("No more notifs to load");
      }
      if (lastNotifViewed) {
        return this.notifs.push(...res.data);
      }
      this.notifs = res.data.notifs;
      this.nonViewedNotifs = res.data.nonViewedNotifs;
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
