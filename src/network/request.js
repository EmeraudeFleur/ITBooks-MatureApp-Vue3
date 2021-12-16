//general requests are here, for specific cmp, create a separate js file.
import axios from "axios";
import { Notify, Toast } from "vant";

export function request(config) {
  const instance = axios.create({
    baseURL: "https://api.shop.eduwork.cn",
    timeout: 5000,
  });
  //请求拦截
  instance.interceptors.request.use(
    (config) => {
      const token = window.localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = "Bearer " + token; //format in api
      }
      return config; //直接让通过
    },
    (err) => {}
  );
  //响应拦截
  instance.interceptors.response.use(
    (res) => {
      return res.data || res;
    },
    (err) => {
      // if (err.response.status === undefined) {
      // }
      //如果有授权才可以访问的，同意去跳转登录
      if (err) {
        if (err.response.status === "401") {
          Toast.fail("Please log in");
          // router.push({ path: "/login" });
        }
        //如果有错误，在这里显示错误信息 print error message from network
        // Notify(
        //   err.response.data.errors[Object.keys(err.response.data.errors)[0]][0]
        // );
      }
    }
  );
  return instance(config);
}
