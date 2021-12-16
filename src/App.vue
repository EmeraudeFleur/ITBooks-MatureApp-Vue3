<template>
  <router-view></router-view>
  <!-- <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view> -->

  <div id="nav">
    <router-link to="/">
      <i class="iconfont icon-home"></i>
    </router-link>
    <router-link to="/category"
      ><i class="iconfont icon-fenlei"></i>
    </router-link>
    <router-link to="/cart">
      <i class="iconfont icon-gouwuche"></i>
      <van-badge
        v-show="$store.state.cartCount"
        :content="$store.state.cartCount"
        max="9"
        color="#eb331b"
      >
      </van-badge>
    </router-link>
    <router-link to="/profile"
      ><i class="iconfont icon-gerenzhongxin"></i>
    </router-link>
  </div>
</template>

<script>
import { onMounted } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    onMounted(() => {
      //update cart item number (repeated item won't count)
      store.dispatch("updateCart");
    });
  },
};
</script>

<style lang="scss">
// import overall styles
@import "assets/css/base.css";
// import menu icon styles
@import "assets/icons/iconfont.css";

#app {
  font-family: Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  background-color: #f6f6f6;
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: 0 -3px 1px rgba(100, 100, 100, 0.1);
  z-index: 10;

  a {
    color: var(--color-text);
    flex: 1;
    text-align: center;
    height: 50px;
    padding: 8px;
    position: relative;

    &.router-link-exact-active {
      color: #197538;
    }
    .van-badge {
      position: absolute;
      top: 1px;
    }
  }
}
</style>
