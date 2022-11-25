<template>
  <Transition name="modal">
    <div class="modal__layer">
      <slot></slot>
    </div>
  </Transition>
</template>

<script setup></script>

<style lang="scss" scoped>
.modal__layer {
  @include jcCt;
  @include width-height_max;
  align-items: center;
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.265);
  transition: opacity 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal__container,
.modal-leave-to .modal__container {
  -webkit-transform: scale(1.02);
  transform: scale(1.02);
}
</style>
