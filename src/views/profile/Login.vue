<template>
  <nav-bar>
    <template v-slot:default>Login</template>
  </nav-bar>
  <div style="margin-top: 60px">
    <h3 style="padding: 30px 0">Welcome Back</h3>
    <van-form @submit="onSubmit">
      <van-field
        v-model="email"
        name="Email"
        label="Email"
        placeholder="Email"
        :rules="[{ required: true, message: 'Email is required' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="Password"
        label="Password"
        placeholder="Password"
        :rules="[{ required: true, message: 'Password is required' }]"
      />

      <div style="margin: 30px">
        <p class="link-login">
          New to ITBooks?
          <router-link to="/register"> Get started</router-link>
        </p>

        <van-button round block type="info" color="#437c56" native-type="submit"
          >Login</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import NavBar from "components/common/navBar/NavBar";
import { reactive, toRefs } from "vue";
import { login } from "network/user";
import { Toast } from "vant";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const userInfo = reactive({
      email: "",
      password: "",
    });

    const onSubmit = () => {
      login(userInfo).then((res) => {
        // console.log(res.access_token);
        // 将token保存在本地 window.localStorage   setItem(key, value) getItem(key)
        window.localStorage.setItem("token", res.access_token);
        // 在vuex isLogin
        store.commit("setLoggedIn", true);

        Toast.success("Logged in!");

        userInfo.email = "";
        userInfo.password = "";

        setTimeout(() => {
          // router.go(-1);
          router.push({ path: "/profile" });
        }, 100);
      });
    };

    return {
      ...toRefs(userInfo),
      onSubmit,
    };
  },
};
</script>

<style scoped lang="scss">
.van-cell.van-field {
  padding: 10px 40px;
}
.link-login {
  text-align: left;
  font-size: 12px;
  margin-left: 10px;
}
.link-login a {
  margin-bottom: 20px;
  color: var(--color-tint);
  display: inline-block;
  text-align: left;
}
</style>
