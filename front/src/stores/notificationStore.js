import { ref } from "vue";
import { defineStore } from "pinia";
import useUserStore from "./userStore.js";
import axios from "axios";

const useNotifStore = defineStore("notif", () => {
  const userStore = useUserStore();
  const notifs = ref([]);
  const nonViewedNotifs = ref(0);

  const getAll = async (userId, lastNotifViewed) => {
    try {
      const res = await axios({
        url: `http://localhost:3000/api/notifications/getAll/${userId}`,
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
        params: {
          lastNotifId: lastNotifViewed,
        },
      });
      if (Object.values(res.data).includes("No more notifications")) {
        console.log("No more notifs to load");
        return false;
      }
      if (lastNotifViewed) {
        return notifs.value.push(...res.data);
      }
      notifs.value = res.data.notifs;
      console.log(notifs.value);
      nonViewedNotifs.value = res.data.nonViewedNotifs;
    } catch (error) {
      console.log(error.response);
    }
  };
  const update = async (notifId) => {
    const res = await axios({
      url: `http://localhost:3000/api/notifications/update/${notifId}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${userStore.token}`,
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
  const updateAll = async (userId) => {
    const res = await axios({
      url: `http://localhost:3000/api/notifications/updateAll/${userId}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    });
    notifs.value = res.data;
    nonViewedNotifs.value = 0;
  };

  return {
    notifs,
    nonViewedNotifs,
    getAll,
    update,
    updateAll,
  };
});

export default useNotifStore;
