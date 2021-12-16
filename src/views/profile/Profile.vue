<template>
  <nav-bar>
    <template v-slot:default>Profile</template>
  </nav-bar>

  <div class="user-box">
    <div class="user-info">
      <div class="info">
        <img src="" />
        <div class="user-desc">
          <span>Name：{{ user.name }}</span>
          <span>Email：{{ user.email }}</span>
          <span class="name">Motto：</span>
        </div>
      </div>
    </div>

    <ul class="user-list">
      <li class="van-hairline--bottom" @click="goTo('/wishlist')">
        <span>Wishlist</span>
        <van-icon name="arrow" />
      </li>
      <li class="van-hairline--bottom" @click="goTo('/order')">
        <span>Orders</span>
        <van-icon name="arrow" />
      </li>
      <li class="van-hairline--bottom" @click="goTo('/setting')">
        <span>Account</span>
        <van-icon name="arrow" />
      </li>
      <li class="van-hairline--bottom" @click="goTo('/address')">
        <span>Address</span>
        <van-icon name="arrow" />
      </li>
      <li class="van-hairline--bottom" @click="goTo('/about')">
        <span>About us</span>
        <van-icon name="arrow" />
      </li>
    </ul>
  </div>

  <div style="margin: 30px">
    <van-button
      v-if="!$store.state.user.loggedIn"
      round
      block
      color="#437c56"
      @click="$router.push({ path: '/login' })"
      >Log In</van-button
    >
    <van-button v-else round block color="#437c56" @click="toLogOut"
      >Log Out</van-button
    >
  </div>
</template>

<script>
import NavBar from "components/common/navBar/NavBar";
import { reactive, toRefs, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { logout, getUser } from "network/user";
import { Toast } from "vant";
import { useStore } from "vuex";

export default {
  components: { NavBar },
  setup() {
    const router = useRouter();
    const store = useStore();

    const state = reactive({
      user: {},
    });

    onMounted(() => {
      if (store.getters.loggedIn) {
        getUser().then((res) => {
          state.user = res;
        });
      }
    });

    watch(
      () => store.getters.loggedIn,
      () => {
        if (store.getters.loggedIn) {
          getUser().then((res) => {
            state.user = res;
          });
        }
      }
    );

    const toLogOut = () => {
      logout().then((res) => {
        if (res.status == "204") {
          Toast.success("Logged out");
          window.localStorage.setItem("token", "");
          store.commit("setLoggedIn", false);
          state.user = {};
        }
      });
    };

    const goTo = (path, query) => {
      router.push({ path, query: query || {} });
    };

    return {
      ...toRefs(state),
      toLogOut,
      goTo,
    };
  },
};
</script>

<style lang="scss" scoped>
.user-box {
  margin-top: 70px;
}
.user-info {
  width: 94%;
  margin: 10px;
  height: 115px;
  background: linear-gradient(90deg, #437c56, #a1c7c7);
  box-shadow: 0 2px 5px #285848;
  border-radius: 6px;
  margin-top: 50px;
  text-align: left;
  .info {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    padding: 25px 20px;

    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-top: 4px;
    }
    .user-desc {
      display: flex;
      flex-direction: column;
      margin-left: 10px;
      line-height: 20px;
      font-size: 14px;
      color: #fff;
      span {
        color: #fff;
        font-size: 14px;
        padding: 2px 0;
      }
    }
  }
}
.user-list {
  padding: 0 20px;
  margin-top: 40px;
  li {
    padding-left: 5px;
    padding-right: 5px;
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    .van-icon-arrow {
      margin-top: 13px;
    }
    margin: 20px 0 !important;
    background: #ffffff;
    border-radius: 3px;
  }
}
</style>
