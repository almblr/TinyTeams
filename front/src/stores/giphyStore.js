import { defineStore } from "pinia";
import axios from "axios";

const useGiphyStore = defineStore("gif", {
  state: () => ({
    gifs: [],
    GIPHY_KEY: "lcUOyzUQjkn8d8MZbdFTekgbf0kD25vt",
    offset_trends: 0,
    offset_search: 0,
  }),
  actions: {
    resetGifs() {
      this.gifs = [];
      this.offset_trends = 0;
      this.offset_search = 0;
    },
    async getTrendsGif() {
      const res = await axios(
        `https://api.giphy.com/v1/gifs/trending?api_key=${this.GIPHY_KEY}&offset=${this.offset_trends}&limit=5`
      );
      this.offset_trends += 5;
      this.gifs.push(...res.data.data);
    },
    async searchGif(q) {
      const res = await axios(
        `https://api.giphy.com/v1/gifs/search?api_key=${this.GIPHY_KEY}&offset=${this.offset_search}&q=${q}&limit=5`
      );
      this.offset_search += 5;
      this.gifs.push(...res.data.data);
    },
  },
});

export default useGiphyStore;
