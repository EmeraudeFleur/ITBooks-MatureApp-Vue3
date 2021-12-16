<template>
  <van-swipe
    v-if="banners"
    class="my-swipe"
    :autoplay="3000"
    indicator-color="gray"
  >
    <van-swipe-item v-for="item in banners" :key="item.id">
      <img v-lazy="item.img_url" alt="" />
    </van-swipe-item>
  </van-swipe>
</template>

<script>
export default {
  props: {
    banners: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style scoped>
img {
  width: 100%;
  height: 180px;
}
</style>
