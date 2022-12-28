<template>
  <!-- <div class="arrow"></div> -->
  <div class="btn">
    <img src="@/assets/gif.png" />
    <div class="tooltip">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias adipisci
      expedita aliquam ex velit, magnam rem voluptates quibusdam dolore facere.
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
/* .arrow {
    width: 0px;
    height: 0px;
    background: orange; 
    border: 1px solid #000;

    border-top: 100px solid crimson;
    border-bottom: 100px solid transparent;
    border-right: 70px solid transparent;
    border-left: 70px solid transparent;
} */

.tooltip {
  position: absolute;
  background: #333;
  border: 4px solid #666;
  width: 400px;
  padding: 30px;
  color: #f1f1f1;
  font-size: 20px;
  top: 52px;
  left: -224px;
  /* display: none; */
  opacity: 0;
  pointer-events: none;
}

.tooltip::after,
.tooltip::before {
  content: "";
  bottom: 100%;
  left: 50%;
  border: solid transparent;
  height: 0;
  width: 0;
  position: absolute;
}
.tooltip::after {
  border-bottom-color: #333;
  border-width: 25px;
  margin-left: -25px;
}
.tooltip::before {
  border-bottom-color: #666;
  border-width: 30px;
  margin-left: -30px;
}

.btn {
  position: relative;
}
.btn img {
  position: relative;
  top: 4px;
  width: 20px;
}
.btn:hover .tooltip {
  /* display: block; */
  pointer-events: all;
  opacity: 1;
  transition: all 0.4s ease;
}
</style>
