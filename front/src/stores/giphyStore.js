import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

const useGiphyStore = defineStore("gif", () => {
  const gifs = ref([]);
  const GIPHY_KEY = "lcUOyzUQjkn8d8MZbdFTekgbf0kD25vt";
  const offset_trends = ref(0);
  const offset_search = ref(0);

  const resetGifs = () => {
    gifs.value = [];
    offset_trends.value = 0;
    offset_search.value = 0;
  };
  const getTrendsGif = async () => {
    const res = await axios(
      `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_KEY}&offset=${offset_trends.value}&limit=5`
    );
    offset_trends.value += 5;
    gifs.value.push(...res.data.data);
  };
  const searchGif = async (q) => {
    const res = await axios(
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_KEY}&offset=${offset_search.value}&q=${q}&limit=5`
    );
    offset_search.value += 5;
    gifs.value.push(...res.data.data);
  };
  return {
    gifs,
    resetGifs,
    getTrendsGif,
    searchGif,
  };
});

export default useGiphyStore;
