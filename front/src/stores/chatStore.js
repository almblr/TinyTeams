import { ref } from "vue";
import { defineStore } from "pinia";
import { socket } from "../socket.js";
import useUserStore from "./userStore.js";
import axios from "axios";

const useChatStore = defineStore("chat", () => {
  const userLS = JSON.parse(sessionStorage.getItem("user"));
  const userStore = useUserStore();
  const conversations = ref([]);
  const messages = ref([]);
  const nonReadMessages = ref(0);
  const conversationMode = ref(false);
  const newMessage = ref(false);
  const showMobileUsersList = ref(false);
  const isDesktop = ref(true);

  const createConversation = async (userId) => {
    const res = await axios({
      url: "http://localhost:3000/api/conversations/create",
      method: "POST",
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
      data: {
        user2: parseInt(userId),
      },
    });
    conversations.value.unshift(res.data);
    return res.data;
  };
  const getOneConv = async (conversationId) => {
    const res = await axios({
      url: `http://localhost:3000/api/conversations/getOne/${conversationId}`,
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    });
    return res.data;
  };
  const getUserConvs = async (lastConversationViewed) => {
    let url = `http://localhost:3000/api/conversations/getAll/`;
    const res = await axios({
      url,
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
      params: {
        lastConversationId: lastConversationViewed,
      },
    });
    if (Object.values(res.data).includes("No more conversations")) {
      return console.log("No more convs to load");
    }
    if (lastConversationViewed) {
      return conversations.value.push(...res.data);
    }
    conversations.value = res.data;
  };
  const updateConv = async (conversationId, lastMessageDate) => {
    const res = await axios({
      url: `http://localhost:3000/api/conversations/update/${conversationId}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
      data: {
        lastMessageDate,
      },
    });
    const updatedConversation = res.data;
    const indexConversation = conversations.value.findIndex(
      (message) => message.id === updatedConversation.id
    );
    conversations.value.splice(indexConversation, 1, updatedConversation);
  };
  const createMessage = async (conversationId, data) => {
    const res = await axios({
      url: `http://localhost:3000/api/conversations/${conversationId}/messages/create`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
      data,
    });
    const conversation = conversations.value.findIndex(
      (c) => c.id === conversationId
    );
    conversations.value.splice(conversation, 1);
    const newConv = await getOneConv(conversationId);
    socket.emit("newMessage", {
      senderId: userLS.id,
      senderUsername: `${userLS.firstname} ${userLS.lastname}`,
      senderProfilePicture: userLS.profilePicture,
      type: "newMessage",
      notifiableId: res.data.id,
      receiver: newConv.otherUser.id,
      token: userStore.token,
    });
    conversations.value.unshift(newConv);
    messages.value.push(res.data);
  };
  const getConversationMsg = async (conversationId, lastMessageViewed) => {
    const res = await axios({
      url: `http://localhost:3000/api/conversations/${conversationId}/messages/getAll`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
      params: {
        lastMessageId: lastMessageViewed,
      },
    });
    if (Object.values(res.data).includes("No more messages")) {
      return console.log("No more messages to load");
    }
    if (lastMessageViewed) {
      return messages.value.push(...res.data);
    }
    messages.value = res.data;
  };
  const getNonReadMsg = async () => {
    const res = await axios({
      url: `http://localhost:3000/api/conversations/messages/getNonRead`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    });
    res.data.unreadMessages === 0
      ? null
      : (nonReadMessages.value = res.data.unreadMessages);
  };
  const markAsRead = async (conversationId, messageId) => {
    const res = await axios({
      url: `http://localhost:3000/api/conversations/${conversationId}/messages/${messageId}/update`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    });
    const updatedMessage = res.data;
    const indexMessage = messages.value.findIndex(
      (m) => m.id === updatedMessage.id
    );
    messages.value[indexMessage].isRead = true;
    nonReadMessages.value--;
  };
  const deleteMessage = async (conversationId, messageId) => {
    await axios({
      url: `http://localhost:3000/api/conversations/${conversationId}/messages/${messageId}/delete`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    });
    const foundMessage = conversations.value.find(
      (message) => message.id === messageId
    );
    messages.splice(foundMessage, 1);
  };

  function $reset() {
    conversations.value = [];
    messages.value = [];
    nonReadMessages.value = [];
    conversationMode.value = false;
    newMessage.value = false;
    showMobileUsersList.value = false;
    isDesktop.value = true;
  }

  return {
    conversations,
    messages,
    newMessage,
    nonReadMessages,
    conversationMode,
    showMobileUsersList,
    isDesktop,
    createConversation,
    getOneConv,
    getUserConvs,
    updateConv,
    createMessage,
    getConversationMsg,
    getNonReadMsg,
    markAsRead,
    deleteMessage,
    $reset,
  };
});

export default useChatStore;
