import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

const useNotifStore = defineStore("notif", () => {
  const token = JSON.parse(sessionStorage.getItem(`token`));
  const userId = JSON.parse(sessionStorage.getItem(`user`)).id;
  const notifs = ref([]);
  const nonViewedNotifs = ref(0);

  const getOne = async (notifId) => {
    const res = await axios({
      url: `http://localhost:3000/api/notifications/getOne/${notifId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const notif = await res.data;
    const foundNotif = notifs.value.find((notif) => notif.id === notifId);
    const index = notifs.value.indexOf(foundNotif);
    notifs.value.splice(index, 1, notif);
  };
  const getAll = async (lastNotifViewed) => {
    let url = `http://localhost:3000/api/notifications/getAll/${userId}`;
    const res = await axios({
      url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        lastNotifId: lastNotifViewed,
      },
    });
    if (Object.values(res.data).includes("No more notifications")) {
      return console.log("No more notifs to load");
    }
    if (lastNotifViewed) {
      return notifs.value.push(...res.data);
    }
    notifs.value = res.data.notifs;
    nonViewedNotifs.value = res.data.nonViewedNotifs;
  };
  const create = async (data) => {
    const res = await axios({
      url: "http://localhost:3000/api/notifications/create",
      method: "CREATE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    });
    notifs.value.unshift(res.data);
    return res.data;
  };
  const update = async (notifId) => {
    const res = await axios({
      url: `http://localhost:3000/api/notifications/update/${notifId}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const updatedNotif = res.data;
    const indexNotif = notifs.value.findIndex(
      (notif) => notif.id === updatedNotif.id
    );
    notifs.value.splice(indexNotif, 1, updatedNotif);
    nonViewedNotifs.value--;
    return res.data;
  };
  const updateAll = async () => {
    const res = await axios({
      url: `http://localhost:3000/api/notifications/updateAll/${userId}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    notifs.value = res.data;
    nonViewedNotifs.value = 0;
  };

  return {
    notifs,
    nonViewedNotifs,
    getOne,
    getAll,
    create,
    update,
    updateAll,
  };
});

export default useNotifStore;
