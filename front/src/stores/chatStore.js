import { ref } from "vue";
import { defineStore } from "pinia";
import { socket } from "../socket.js";
import useUserStore from "./userStore.js";
import axios from "axios";

const useChatStore = defineStore("chat", () => {
  const userStore = useUserStore();
  const conversations = ref([]);
  const messages = ref([]);
  const nonReadMessages = ref(0);
  const isConversationMode = ref(false);
  const newMessage = ref(false);
  const showMobileUsersList = ref(false);
  const isDesktop = ref(true);

  /// CONVERSATIONS ///
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
  const getOneConversation = async (conversationId) => {
    const res = await axios({
      url: `http://localhost:3000/api/conversations/getOne/${conversationId}`,
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    });
    return res.data;
  };
  const getUserConversations = async (lastConversationViewed) => {
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
      return;
    }
    if (lastConversationViewed) {
      return conversations.value.push(...res.data);
    }
    conversations.value = res.data;
  };

  /// MESSAGES ///
  const createMessage = async (conversationId, data) => {
    const res = await axios({
      url: `http://localhost:3000/api/conversations/${conversationId}/messages/create`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
      data,
    });
    const conv = conversations.value.find((c) => c.id === conversationId);
    socket.emit("newMessage", { id: conv.otherUser.id }, res.data.message);
    const convIdx = conversations.value.indexOf(conv);
    conversations.value.splice(convIdx, 1);
    conversations.value.unshift(res.data.conversation);
    messages.value.push(res.data.message);
  };
  const getConversationMessages = async (conversationId, lastMessageViewed) => {
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
      return messages.value.unshift(...res.data);
    }
    messages.value = res.data;
  };
  const getNonReadMessages = async () => {
    const res = await axios({
      url: `http://localhost:3000/api/conversations/messages/getNonRead`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    });
    nonReadMessages.value = res.data.unreadMessages;
    return res.data.unreadMessages;
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
    messages.value.splice(indexMessage, 1, updatedMessage);
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

  /// RESET ///
  function $reset() {
    conversations.value = [];
    messages.value = [];
    isConversationMode.value = false;
    newMessage.value = false;
    showMobileUsersList.value = false;
    isDesktop.value = true;
    nonReadMessages.value = 0;
  }

  return {
    conversations,
    messages,
    newMessage,
    nonReadMessages,
    isConversationMode,
    showMobileUsersList,
    isDesktop,
    createConversation,
    getOneConversation,
    getUserConversations,
    createMessage,
    getConversationMessages,
    getNonReadMessages,
    markAsRead,
    deleteMessage,
    $reset,
  };
});

export default useChatStore;
