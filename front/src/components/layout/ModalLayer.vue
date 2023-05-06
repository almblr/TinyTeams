<template>
  <Transition name="modal">
    <div class="modal__layer">
      <slot></slot>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.modal__layer {
  @include jcCt-aiCt;
  @include width-height_max;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.265);
  transition: opacity 0.3s ease;
}
</style>
