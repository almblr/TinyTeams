<template>
  <div class="container">
    <div class="band"></div>
    <img class="profilPicture" :src="props.profilPictureUrl" />
    <div class="userInfo">
      <h2 class="userInfo__name">Pierre Dupont</h2>
      <p class="userInfo__job">Développeur</p>
      <div class="userInfo__followBtn">
        <fa icon="fa-solid fa-user-plus" />S'abonner
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  profilPictureUrl: String,
});
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  @include fdCol-aiCt;
  max-width: 700px;
  width: 100%;
  min-height: 250px;
  background-color: white;
  transition: 300ms;
}

.band {
  min-width: 100%;
  height: 65px;
  background-color: rgb(36, 51, 100);
}

.profilPicture {
  position: absolute;
  top: 10px;
  width: 110px;
  height: 110px;
  border-radius: 55px;
  object-fit: cover;
  border: 4px solid white;
}

.userInfo {
  @include fdCol-jcCt-aiCt;
  position: relative;
  flex: 1;
  padding-top: 40px;
  width: 100%;
  color: rgb(48, 43, 43);
  &__followBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    width: 200px;
    height: 35px;
    text-align: center;
    border-radius: 5px;
    font-size: 19px;
    color: #ffffff;
    gap: 10px;
    background-color: #2374e1;
    transition: 200ms;
    &:hover {
      background-color: #2375e1ec;
      cursor: pointer;
    }
  }
}

@media all and (min-width: 750px) {
  .container {
    min-height: 300px;
    width: 95%;
    border-radius: 7px;
    margin-top: 2em;
    overflow: hidden;
  }
  .band {
    height: 90px;
  }
  .profilPicture {
    top: 40px;
  }
}
</style>
