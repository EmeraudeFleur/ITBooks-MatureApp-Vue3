<template>
  <nav-bar>
    <template v-slot:default>Register </template>
  </nav-bar>
  <div style="margin-top: 60px">
    <h3 style="padding: 30px 0">Welcome to ITBooks</h3>
    <van-form @submit="onSubmit" class="van-form">
      <van-field
        v-model="name"
        name="Username"
        label="Username"
        placeholder="Username"
        :rules="[{ required: true, message: 'Username is required' }]"
      />
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
      <van-field
        v-model="password_confirmation"
        type="password"
        name="Password_confirmation"
        label="Confirm"
        placeholder="Confirm Password"
        :rules="[
          { required: true, message: 'Password confirmation is required' },
        ]"
      />
      <div style="margin: 30px">
        <p class="link-login">
          Already a member ?
          <router-link to="/login"> Log in</router-link>
        </p>
        <van-button
          round
          block
          color="#437c56"
          type="info"
          native-type="submit"
        >
          Register
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import NavBar from "components/common/navBar/NavBar";
import { reactive, toRefs } from "vue";
import { Notify, Toast } from "vant";
import { register } from "network/user";
import { useRouter } from "vue-router";
export default {
  components: { NavBar },
  setup() {
    const router = useRouter();
    const userInfo = reactive({
      name: "",
      password: "",
      password_confirmation: "",
      email: "",
    });
    const onSubmit = () => {
      //  validate password input
      if (userInfo.password !== userInfo.password_confirmation) {
        Notify("Passwords do not match.");
      } else {
        //print general errors in network user file
        register(userInfo).then((res) => {
          if (res.status === 201) {
            Toast("Success!");
            //jump to login
            setTimeout(() => {
              router.push({ path: "/login" });
              userInfo.password = "";
              userInfo.password_confirmation = "";
            }, 1000);
          }
        });
      }
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
