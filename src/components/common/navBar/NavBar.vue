<template>
  <div class="navbar">
    <div class="left" @click="goBack">
      <slot name="left">
        <img src="~assets/images/left.png" alt="" />
      </slot>
    </div>
    <div class="middle"><slot>EW SHOP </slot></div>
    <div class="right"><slot name="right"></slot></div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
export default {
  // methods: {
  //   goBack() {
  //     this.$router.go(-1);
  //   },
  // },
  setup() {
    const router = useRouter();
    const goBack = () => {
      router.go(-1);
    };
    return {
      goBack,
    };
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  background-color: var(--color-tint);
  color: #ffffff;
  position: fixed;
  top: 0;
  /* strech to left and right = left:0; right:0*/
  width: 100vw;
  height: 45px;
  /* adds equal space above and below the line-box of inline element */
  /* if the height of the container is known, then setting a line-height of the same value will vertically center the child elements. */
  line-height: 45px;
  text-align: center;
  box-shadow: 0 2px 0px rgba(100, 100, 100, 0.1);
  z-index: 10;
}

.left,
.right {
  width: 60px;
}

.left img {
  padding: 10px;
  /* image exceeding div fix */
  max-width: 100%;
  max-height: 100%;
}

.middle {
  /* flex-grow fill in the whole space */
  flex: 1;
}
</style>
