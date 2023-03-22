<template>
  <div
    class="switch"
    :class="{ 'switch-ligth': !isDark }"
    @click="toggleDark()"
  >
    <span :class="{ slider: true, 'slider-light': !isDark }"></span>
  </div>
</template>

<script setup>
import { useDark, useToggle } from "@vueuse/core";
const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<style lang="scss" scoped>
.switch {
  position: relative;
  min-width: 40px;
  min-height: 22px;
  background-color: #28292c;
  border-radius: 25px;
  border: 2px solid #414347;
  transition: 0.3s;
  cursor: pointer;
}

.switch-ligth {
  background-color: #d8dbe0;
}

.slider {
  position: absolute;
  top: 3px;
  left: 5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #28292c;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  -webkit-box-shadow: inset 4px -3px 0px 0px #d8dbe0;
  box-shadow: inset 4px -3px 0px 0px #d8dbe0;
}

.slider-light {
  -webkit-transform: translateX(16px);
  -ms-transform: translateX(16px);
  transform: translateX(16px);
  -webkit-box-shadow: none;
  box-shadow: none;
}
</style>
